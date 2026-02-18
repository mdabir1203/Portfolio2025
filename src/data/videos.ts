export interface Video {
    id: string;
    title: string;
    category: string;
    views: string;
    description: string;
    link: string;
}

export const videos: Video[] = [
    {
        id: '2ptmYpUoopw',
        title: 'Quantum Circuit Prototyping with Generative AI',
        category: 'Quantum Computing',
        views: '12K+ Views',
        description: 'A deep-dive into leveraging GenAI to accelerate quantum circuit design and intuition building.',
        link: 'https://www.youtube.com/watch?v=2ptmYpUoopw'
    },
    {
        id: 'HMLGoo7D6yk',
        title: 'Advanced AIC - High Stability Agentic Workflows',
        category: 'AI Systems',
        views: '8.4K+ Views',
        description: 'Engineering resilient multi-agent systems that handle high-complexity enterprise tasks.',
        link: 'https://www.youtube.com/watch?v=HMLGoo7D6yk'
    },
    {
        id: 'Lwc7-qnbnjc',
        title: 'How to TITLE Your YouTube Videos to Get More Views',
        category: 'Content Strategy',
        views: '105K+ Views',
        description: '7 BEST Strategies to optimize YouTube video titles for maximum reach and engagement.',
        link: 'https://youtu.be/Lwc7-qnbnjc'
    }
];
