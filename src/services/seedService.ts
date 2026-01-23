import { MOCK_EVENTS } from '../data/mockEvents';
import { AuthService } from './authService';
import { CategoryService } from './categoryService';
import { EventService } from './eventService';

const MOCK_USER = {
  email: 'organizer@example.com',
  password: 'password123',
  firstName: 'Event',
  lastName: 'Organizer',
};

export class SeedService {
  static async seedDatabase() {
    try {
      console.log('🌱 Starting database seed...');

      // Step 1: Create/Login organizer
      let organizerId: string;
      try {
        console.log('👤 Creating organizer user...');
        const authResponse = await AuthService.register(
          MOCK_USER.email,
          MOCK_USER.password,
          MOCK_USER.firstName,
          MOCK_USER.lastName
        );
        organizerId = authResponse.user.id;
        console.log('✅ Created organizer user:', organizerId);
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log('👤 Organizer exists, logging in...');
          const loginResponse = await AuthService.login(MOCK_USER.email, MOCK_USER.password);
          organizerId = loginResponse.user.id;
          console.log('✅ Logged in existing organizer:', organizerId);
        } else {
          console.error('❌ Failed to create/login organizer:', error.message);
          throw error;
        }
      }

      // Step 2: Get or create categories
      console.log('📁 Processing categories...');
      const categories: Record<string, string> = {};
      const uniqueCategories = [...new Set(MOCK_EVENTS.map((e) => e.category))];

      let existingCategories;
      try {
        existingCategories = await CategoryService.getAllCategories();
        console.log(`📁 Found ${existingCategories.length} existing categories`);
      } catch (error: any) {
        console.log('📁 No existing categories found, will create new ones');
        existingCategories = [];
      }

      const existingCategoryMap = new Map(existingCategories.map(c => [c.name, c._id]));

      for (const categoryName of uniqueCategories) {
        if (existingCategoryMap.has(categoryName)) {
          categories[categoryName] = existingCategoryMap.get(categoryName)!;
          console.log(`  ✓ Category exists: ${categoryName} (${categories[categoryName]})`);
        } else {
          try {
            const response = await CategoryService.createCategory({
              name: categoryName,
              description: `${categoryName} events`,
            });
            categories[categoryName] = response._id;
            console.log(`  ✅ Created category: ${categoryName} (${categories[categoryName]})`);
          } catch (error: any) {
            console.error(`  ❌ Failed to create category ${categoryName}:`, error.message);
            throw error;
          }
        }
      }

      console.log('📁 All categories ready:', Object.keys(categories));

      // Step 3: Create events
      console.log('🎫 Processing events...');
      let existingEvents;
      try {
        existingEvents = await EventService.getAllEvents();
        console.log(`🎫 Found ${existingEvents.length} existing events`);
      } catch (error: any) {
        console.log('🎫 No existing events found');
        existingEvents = [];
      }

      let createdCount = 0;
      let skippedCount = 0;
      let failedCount = 0;

      for (const event of MOCK_EVENTS) {
        try {
          // Check if event already exists
          const eventExists = existingEvents.some(e => 
            e.title === event.title
          );
          
          if (eventExists) {
            console.log(`  ⏭️  Event exists: ${event.title}`);
            skippedCount++;
            continue;
          }

          // Make sure we have the category ID
          const categoryId = categories[event.category];
          if (!categoryId) {
            console.error(`  ❌ Missing category ID for: ${event.category}`);
            failedCount++;
            continue;
          }

          // Create the event with proper date formatting
          const eventDate = new Date(event.date + 'T' + event.time + ':00.000Z');
          
          await EventService.createEvent({
            title: event.title,
            description: event.description,
            category: categoryId,
            date: eventDate.toISOString(),
            location: `${event.location}, ${event.city}`,
            price: event.price,
            capacity: event.capacity,
            ticketsAvailable: event.availableTickets,
            image: event.image,
          });
          
          console.log(`  ✅ Created event: ${event.title}`);
          createdCount++;
          
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error: any) {
          console.error(`  ❌ Failed to create event "${event.title}":`, error.message);
          failedCount++;
        }
      }

      console.log('\n📊 Seeding Summary:');
      console.log(`  ✅ Created: ${createdCount} events`);
      console.log(`  ⏭️  Skipped: ${skippedCount} events`);
      console.log(`  ❌ Failed: ${failedCount} events`);
      console.log('🎉 Database seed completed!\n');

      return {
        success: true,
        created: createdCount,
        skipped: skippedCount,
        failed: failedCount
      };
    } catch (error: any) {
      console.error('💥 Critical error seeding database:', error);
      throw error;
    }
  }
}