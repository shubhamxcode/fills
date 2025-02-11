export interface Framework {
    name: string;
    displayName: string;
    path: string;
    color: string;
}

export const frameworks: Framework[] = [
    { name: 'services', displayName: 'Services', path: '/', color: '#FF5D01' },
    { name: 'usecases', displayName: 'Use Cases', path: '/use-cases', color: '#61DAFB' },
    { name: 'process', displayName: 'Process', path: '/process', color: '#4FC08D' },
    { name: 'pricing', displayName: 'Pricing', path: '/pricing', color: '#FF3E00' },
    { name: 'about', displayName: 'About', path: '/about', color: '#2C4F7C' },
];
