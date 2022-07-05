import providers from './../../shared/providers';

const attributes = {
    markers: {
        type: 'array',
        default: []
    },
    themeId: {
        type: 'number',
        default: providers[0].id
    },
    themeUrl: {
        type: 'string',
        default: providers[0].url
    },
    themeAttribution: {
        type: 'string',
        default: providers[0].attribution
    },
    height: {
        type: 'number',
        default: 800
    },
    regions: {
        type: 'array',
        default: []
    },
    categories: {
        type: 'array',
        default: []
    }
}

export default attributes;