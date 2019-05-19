/* @flow */

export interface Theme {
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
}

export interface TypographyVariants {
    h1: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    h2: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    h3: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    h4: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    h5: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    h6: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    subtitle1: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    subtitle2: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    body1: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    body2: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    button: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    caption: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    },
    overline: {
        fontWeight?: string,
        fontSize?: number,
        letterSpacing?: number,
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    }
}

export interface ThemeDefault {
    palette: Theme,
    typography: TypographyVariants
}

export interface StyleCssBase {
    padding?: number,
    paddingBottom?: number,
    paddingTop?: number,
    paddingLeft?: number,
    paddingRight?: number,
    paddingHorizontal?: number,
    paddingVertical?: number,
    margin?: number,
    marginBottom?: number,
    marginTop?: number,
    marginLeft?: number,
    marginRight?: number,
    marginHorizontal?: number,
    marginVertical?: number
}

export interface TypographyStyle {
    fontFamily?: string,
    fontWeight?: '300' | '400' | '500',
    fontSize?: number,
    letterSpacing?: number,
    color?: null | string,
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'
}

export interface TypographyStyle {
    padding?: number,
    paddingBottom?: number,
    paddingTop?: number,
    paddingLeft?: number,
    paddingRight?: number,
    paddingHorizontal?: number,
    paddingVertical?: number,
    margin?: number,
    marginBottom?: number,
    marginTop?: number,
    marginLeft?: number,
    marginRight?: number,
    marginHorizontal?: number,
    marginVertical?: number
}
