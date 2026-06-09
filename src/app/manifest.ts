import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Jozi Student Hub',
        short_name: 'JSH',
        description: 'Your #1 Plug for student essentials in Johannesburg.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/images/logo.png',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            }
        ],
    }
}
