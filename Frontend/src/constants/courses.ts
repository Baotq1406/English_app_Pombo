export interface Lesson {
    id: string;
    title: string;
    meta: string;
    status: 'completed' | 'current' | 'locked';
    type: 'vocabulary' | 'test';
}

export interface Chapter {
    id: string;
    title: string;
    progressText: string;
    isCompleted: boolean;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    instructor: string;
    image: string;
    banner: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    status: 'ongoing' | 'completed';
    completionDate?: string;
    rewardAmount?: number;
    rewardType?: 'coin' | 'gem';
    rewardText?: string;
    chapters: Chapter[];
}

export const ALL_COURSES: Course[] = [
    {
        id: 'ongoing-1',
        title: 'English for Travel',
        instructor: 'Kurnia Majid',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
        banner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
        progress: 0.45,
        completedLessons: 9,
        totalLessons: 20,
        status: 'ongoing',
        chapters: [
            {
                id: 'c1',
                title: 'Chương 1: Airport & Arrival Vocabulary',
                progressText: '3/3 Bài học',
                isCompleted: true,
                lessons: [
                    { id: 'l1', title: 'Từ vựng: Checking In & Luggage', meta: '10 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 'l2', title: 'Từ vựng: Security Check & Boarding', meta: '15 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 't1', title: 'Bài Test: Ôn tập từ vựng Sân bay', meta: '20 mins • Ôn tập', status: 'completed', type: 'test' },
                ]
            },
            {
                id: 'c2',
                title: 'Chương 2: Getting Around City',
                progressText: '1/3 Bài học',
                isCompleted: false,
                lessons: [
                    { id: 'l3', title: 'Từ vựng: Asking for Directions in the street', meta: '12 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 'l4', title: 'Từ vựng: Public Transport (Bus, Train)', meta: '15 mins • Từ vựng', status: 'current', type: 'vocabulary' },
                    { id: 't2', title: 'Bài Test: Ôn tập từ vựng Di chuyển', meta: '20 mins • Ôn tập', status: 'locked', type: 'test' },
                ]
            }
        ]
    },
    {
        id: 'ongoing-2',
        title: 'IELTS Speaking Masterclass',
        instructor: 'Sarah Connor',
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070',
        banner: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070',
        progress: 0.3,
        completedLessons: 6,
        totalLessons: 20,
        status: 'ongoing',
        chapters: [
            {
                id: 'c1',
                title: 'Chương 1: Introduction & Hobbies',
                progressText: '2/3 Bài học',
                isCompleted: false,
                lessons: [
                    { id: 'l1', title: 'Từ vựng: Talk about Hobbies', meta: '10 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 'l2', title: 'Từ vựng: Expressing Likes & Dislikes', meta: '15 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 't1', title: 'Bài Test: Speaking Part 1 Practice', meta: '20 mins • Ôn tập', status: 'current', type: 'test' },
                ]
            }
        ]
    },
    {
        id: 'completed-1',
        title: 'Grammar & Vocab Essentials',
        instructor: 'John Doe',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973',
        banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973',
        progress: 1,
        completedLessons: 6,
        totalLessons: 6,
        status: 'completed',
        completionDate: '12/05/2023',
        rewardAmount: 200,
        rewardType: 'coin',
        rewardText: '+200 Coins',
        chapters: [
            {
                id: 'c1',
                title: 'Chương 1: Tense & Time',
                progressText: '3/3 Bài học',
                isCompleted: true,
                lessons: [
                    { id: 'l1', title: 'Từ vựng: Words expressing Time', meta: '10 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 'l2', title: 'Từ vựng: Adverbs of Frequency', meta: '15 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 't1', title: 'Bài Test: Ôn tập từ chỉ thời gian', meta: '20 mins • Ôn tập', status: 'completed', type: 'test' },
                ]
            },
            {
                id: 'c2',
                title: 'Chương 2: Work & Jobs',
                progressText: '3/3 Bài học',
                isCompleted: true,
                lessons: [
                    { id: 'l3', title: 'Từ vựng: Professions & Workplaces', meta: '12 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 'l4', title: 'Từ vựng: Office Equipment', meta: '10 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 't2', title: 'Bài Test: Ôn tập từ vựng Công việc', meta: '20 mins • Ôn tập', status: 'completed', type: 'test' },
                ]
            }
        ]
    },
    {
        id: 'completed-2',
        title: 'Basic Vocabulary',
        instructor: 'Emily Chen',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098',
        banner: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098',
        progress: 1,
        completedLessons: 10,
        totalLessons: 10,
        status: 'completed',
        completionDate: '01/04/2023',
        rewardAmount: 50,
        rewardType: 'gem',
        rewardText: '+50 Gems',
        chapters: [
            {
                id: 'c1',
                title: 'Chương 1: Family & Friends',
                progressText: '5/5 Bài học',
                isCompleted: true,
                lessons: [
                    { id: 'l1', title: 'Từ vựng: Family Members', meta: '10 mins • Từ vựng', status: 'completed', type: 'vocabulary' },
                    { id: 't1', title: 'Bài Test: Vocabulary Quiz 1', meta: '15 mins • Ôn tập', status: 'completed', type: 'test' },
                ]
            }
        ]
    }
];