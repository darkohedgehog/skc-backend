module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'local',
            sizeLimit: 100000000, // Maksimalna veličina fajla u bajtovima
            providerOptions: {
                // Ostale opcije za provider, ako ih imate
            },
            actionOptions: {
                upload: {},
                delete: {},
            },
        },
    },
});
