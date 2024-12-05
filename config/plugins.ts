module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'local',
            providerOptions: {
                sizeLimit: 100000000, // Maksimalna veličina fajla u bajtovima
            },
            actionOptions: {
                upload: {},
                delete: {},
            },
        },
    },
});
