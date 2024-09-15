import { StyleSheet } from 'react-native';

export const createStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.background,
    },
    text: {
        color: colors.text,
        textAlign: 'left',
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
    noteInput: {
        flex: 1, // Makes the input expand to fill the available space
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        textAlignVertical: 'top', // Ensures text starts at the top of the TextInput
        color: colors.text,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginLeft: 10,
    },
    todoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: colors.background,
    },
    taskContainer: {
        flex: 1,
        marginLeft: 10,
    },
    completedTask: {
        textDecorationLine: 'line-through', // Strike-through for completed tasks
        color: 'gray',
    },
    textTodo: {
        color: colors.text,
    },
});