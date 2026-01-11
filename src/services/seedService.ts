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
      console.log('Starting database seed...');

      let organizerId: string;
      try {
        const authResponse = await AuthService.register(
          MOCK_USER.email,
          MOCK_USER.password,
          MOCK_USER.firstName,
          MOCK_USER.lastName
        );
        organizerId = authResponse.user.id;
        console.log('Created organizer user');
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          const loginResponse = await AuthService.login(MOCK_USER.email, MOCK_USER.password);
          organizerId = loginResponse.user.id;
          console.log('Logged in existing organizer user');
        } else {
          throw error;
        }
      }

      const categories: Record<string, string> = {};
      const uniqueCategories = [...new Set(MOCK_EVENTS.map((e) => e.category))];

      for (const categoryName of uniqueCategories) {
        try {
          const response = await CategoryService.createCategory({
            name: categoryName,
            description: `${categoryName} events`,
          });
          categories[categoryName] = response._id;
          console.log(`Created category: ${categoryName}`);
        } catch (error: any) {
          if (error.message.includes('unique')) {
            const allCategories = await CategoryService.getAllCategories();
            const existing = allCategories.find((c) => c.name === categoryName);
            if (existing) {
              categories[categoryName] = existing._id;
              console.log(`Category already exists: ${categoryName}`);
            }
          } else {
            throw error;
          }
        }
      }

      for (const event of MOCK_EVENTS) {
        try {
          await EventService.createEvent({
            title: event.title,
            description: event.description,
            category: categories[event.category],
            date: new Date(event.date).toISOString(),
            location: `${event.location}, ${event.city}`,
            price: event.price,
            capacity: event.capacity,
            ticketsAvailable: event.availableTickets,
            image: event.image,
          });
          console.log(`Created event: ${event.title}`);
        } catch (error: any) {
          console.log(`Event already exists or error: ${event.title}`);
        }
      }

      console.log('Database seed completed successfully!');
      return true;
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
}
