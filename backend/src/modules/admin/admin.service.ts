import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  getDashboard() {
    return {
      message: 'Admin dashboard - Phase 1 MVP',
      stats: {
        totalUsers: 0,
        totalProjects: 0,
        totalNotices: 0,
      },
    };
  }
}

