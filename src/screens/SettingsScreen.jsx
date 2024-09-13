// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';
import DropDownPicker from 'react-native-dropdown-picker';

export default function SettingsScreen() {
    const { colors, toggleTheme } = useTheme();
    const styles = createStyles(colors);

    console.log('Current theme colors:', colors); // Debugging line

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
        <View style={styles.container}>
            <Text style={styles.text}>Settings Screen</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{ backgroundColor: colors.button, borderColor: colors.button }}
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
