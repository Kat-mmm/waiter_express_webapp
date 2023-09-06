export default function WaiterApp(){
    let theName = '';
    let theEmail = '';
    let thePassword = '';
    let theDays = [];
    let selectedDays = {};

    function setSelectedDays(days){
        selectedDays = {}; // Clear the previous selection

        days.forEach((day) => {
            selectedDays[day] = true;
        });
    }

    function getSelectedDays(){
        return selectedDays;
    }

    function setDays(days){
        theDays = days;
        
        // setSelectedDays(days); // Add this line to initialize selectedDays
    }

    function getDays(){
        return theDays;
    }

    return{
        setDays,
        getDays,
        setSelectedDays,
        getSelectedDays
    }
}