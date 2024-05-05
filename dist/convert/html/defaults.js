export const htmlDefaults = {
    h1: {
        defaultProperties: {
            //tailwind disables this marginY: 10.67,
            fontSize: 32,
            fontWeight: 'bold',
        },
    },
    h2: {
        defaultProperties: {
            //tailwind disables this marginY: 13.28,
            fontSize: 24,
            fontWeight: 'bold',
        },
    },
    h3: {
        defaultProperties: {
            //tailwind disables this marginY: 16,
            fontSize: 18.72,
            fontWeight: 'bold',
        },
    },
    h4: {
        defaultProperties: {
            //tailwind disables this marginY: 21.28,
            fontSize: 16,
            fontWeight: 'bold',
        },
    },
    h5: {
        defaultProperties: {
            //tailwind disables this marginY: 26.72,
            fontSize: 13.28,
            fontWeight: 'bold',
        },
    },
    h6: {
        defaultProperties: {
            //tailwind disables this marginY: 37.28,
            fontSize: 10.67,
            fontWeight: 'bold',
        },
    },
    p: {
        defaultProperties: {
        //tailwind disables this marginY: 16
        },
    },
    a: {
        //TODO: custom property converter href => onClick ...
        defaultProperties: {
            //color: 'blue',
            cursor: 'pointer',
        },
    },
    img: {
        renderAs: 'Image',
    },
    button: { defaultProperties: { cursor: 'pointer' } },
    input: {
        renderAs: 'Input',
        children: 'none',
    },
    textarea: {
        renderAs: 'Input',
        children: 'none',
        defaultProperties: { multiline: true },
    },
    video: {
        renderAs: 'VideoContainer',
    },
};
//TBD select option
