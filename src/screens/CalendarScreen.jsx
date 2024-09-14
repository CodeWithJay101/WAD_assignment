import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const CalendarScreen = () => {

    return (
        <Calendar
            onDayPress={day => {
                console.log('selected day', day);
            }}
        />
    );
};

export default CalendarScreen;