import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import DropDownPicker from 'react-native-dropdown-picker';

export default function SettingsScreen() {
    const { colors, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(colors.background === '#ffffff' ? 'light' : 'dark');
    const [items, setItems] = useState([
        { label: 'Light Theme', value: 'light' },
        { label: 'Dark Theme', value: 'dark' },
    ]);

    const handleChangeTheme = (theme) => {
        toggleTheme();
        setValue(theme);
    };

    return (
        <View style={styles.container(colors)}>
            <Text style={styles.text(colors)}>Settings Screen</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{
                    backgroundColor: colors.button,
                    borderColor: colors.button,
                }}
                textStyle={{ color: colors.text }}
                dropDownContainerStyle={{ backgroundColor: colors.background }}
                onChangeValue={(theme) => {
                    handleChangeTheme(theme);
                    setValue(theme);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: (colors) => ({
        flex: 1,
        padding: 10,
        backgroundColor: colors.background,
    }),
    text: (colors) => ({
        color: colors.text,
        textAlign: 'left',
    }),
});
