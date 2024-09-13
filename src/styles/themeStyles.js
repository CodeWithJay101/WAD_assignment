//src/styles/themeStyles.js
import { StyleSheet } from 'react-native';

export const createStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.background,
    },
    text: {
        color: colors.text,
    },
    header: {
        color: colors.text,
        backgroundColor: colors.header,
    },
    input: {
        borderColor: colors.text,
        color: colors.text,
    },
    todoContainer: {
        marginBottom: 10,
    },
});