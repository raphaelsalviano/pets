/* @flow */

export type Theme = {
    colorPrimary: string,
    colorPrimaryDark: string,
    colorAccent: string,
    colorControlHighlight: string, // ripple color
    colorControlNormal: string, // color decoration intens (example arrow spinner)
    colorSwitchThumbNormal: string, // color switch - usually accentColor
    colorBackground: string,
    colorOverlay: string,
    colorDivider: string,
    textColorPrimary: string, // text primary
    textColorSecondary: string, // text hint
    textColorTertiary: string, // text disable
    textColorError: string,
    fontFamily: string
};

export type TypographyVariants = {
    +h1: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +h2: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +h3: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +h4: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +h5: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +h6: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +subtitle1: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +subtitle2: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +body1: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +body2: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +button: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +caption: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    +overline: {
        +fontWeight?: '300' | '400' | '500',
        +fontSize?: number,
        +letterSpacing?: number,
        +textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    }
};

export type ThemeDefault = {
    variant: 'white' | 'dark',
    palette: Theme,
    icoFontRes?: any,
    +typography: TypographyVariants
};
