import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme } from "@mui/material";
import { green, grey, orange } from "@mui/material/colors/index.js";

const storedDarkThemeSetting = JSON.parse(localStorage.getItem("appDarkTheme")) ?? false;

const primaryColor = green;
const secondaryColor = orange;

const AppThemeContext = createContext();

const AppThemeProvider = ({ children }) => {
    const [appDarkTheme, setAppDarkTheme] = useState(storedDarkThemeSetting);

    const finalTheme = useMemo(() => (createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...theme.typography.body1
                    })
                },
                variants: [
                    {
                        props: { variant: "outlined" },
                        style: {
                            borderWidth: "2px !important"
                        }
                    }
                ]
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...theme.typography.h6
                    })
                }
            },
            MuiStack: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...theme.typography.body1
                    })
                }
            },
            MuiDialog: {
                defaultProps: {
                    disableEscapeKeyDown: true
                },
                styleOverrides: {
                    root: {
                        zIndex: 10000
                    }
                }
            },
            MuiFab: {
                styleOverrides: {
                    root: {
                        zIndex: 8000
                    }
                }
            },
            MuiDialogTitle: {
                defaultProps: {
                    textAlign: "center",
                    variant: "h4"
                }
            },
            MuiTable: {
                defaultProps: {
                    size: "small",
                    stickyHeader: true
                }
            },
            MuiTableContainer: {
                styleOverrides: {
                    root: () => ({
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        gridTemplateAreas: `
                            "header"
                            "rows"
                        `,
                        gridTemplateRows: "40px calc(100% - 40px)"
                    })
                },
                defaultProps: {

                }
            },
            MuiTableHead: {
                styleOverrides: {
                    root: () => ({
                        gridArea: "header"
                    })
                }
            },
            MuiTableBody: {
                styleOverrides: {
                    root: () => ({
                        gridArea: "rows"
                    })
                }
            },
            MuiSnackbar: {
                defaultProps: {
                    anchorOrigin: {
                        horizontal: "center",
                        vertical: "bottom"
                    },
                    autoHideDuration: 3000
                },
                styleOverrides: {
                    root: () => ({
                        zIndex: 10000000
                    })
                }
            },
            MuiTextField: {
                defaultProps: {
                    autoComplete: "off"
                }
            }
        },
        typography: {
            fontFamily: "Helvetica",
            fontSize: 12,
            body1: {
                fontWeight: 500,
                fontSize: "0.9rem"
            }
        },
        palette: {
            mode: appDarkTheme ? "dark" : "light",
            primary: {
                main: appDarkTheme ? primaryColor["700"] : primaryColor["900"],
                light: primaryColor["500"],
                contrastText: "white",
                200: primaryColor["200"],
                100: primaryColor["100"],
                translucent: `${primaryColor["700"]}40`,
                veryTranslucent: `${primaryColor["700"]}20`
            },
            secondary: {
                main: secondaryColor["700"],
                contrastText: "white",
                200: secondaryColor["200"],
                100: secondaryColor["100"],
                translucent: `${secondaryColor["700"]}40`,
                veryTranslucent: `${secondaryColor["700"]}20`
            },
            grey: {
                main: grey["600"],
                contrastText: appDarkTheme ? "white" : "black",
                translucent: appDarkTheme ? grey["800"] : "#CCC",
                veryTranslucent: appDarkTheme ? "#333" : "#EEE"
            },
            lightgrey: {
                main: appDarkTheme ? grey["500"] : grey["700"]
            }
        }
    })), [appDarkTheme]);

    const appThemeContextValue = useMemo(() => {
        return {
            appDarkTheme,
            setAppDarkTheme
        };
    }, [appDarkTheme, setAppDarkTheme]);

    return (
        <AppThemeContext.Provider value={appThemeContextValue}>
            <ThemeProvider theme={finalTheme}>
                {children}
            </ThemeProvider>
        </AppThemeContext.Provider>
    );
};

export const useAppDarkTheme = () => {
    const { appDarkTheme, setAppDarkTheme } = useContext(AppThemeContext);
    const handleDarkThemeChange = useCallback((isEnabled) => {
        setAppDarkTheme(isEnabled);
        localStorage.setItem("appDarkTheme", JSON.stringify(isEnabled));
    }, [setAppDarkTheme]);
    return { appDarkTheme, setAppDarkTheme: handleDarkThemeChange };
};

AppThemeProvider.propTypes = {
    children: PropTypes.node
};

export default AppThemeProvider;
