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
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        color: colors.text,
        marginBottom: 10,
    },
    dropdown: {
        borderColor: 'gray',
    },
    textArea: {
        color: colors.text,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    label: {
        color: colors.text,
        marginBottom: 5,
    },
    textArea: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.text,
    },
});