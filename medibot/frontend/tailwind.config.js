export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#25D366',
                primaryDark: '#128C7E',
                userBubble: '#DCF8C6',
                botBubble: '#FFFFFF',
            },
            animation: {
                'bounce-dot': 'bounce 1s infinite',
            }
        },
    },
    plugins: [],
}
