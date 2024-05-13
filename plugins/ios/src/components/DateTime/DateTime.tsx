export const TimeSinceUpdate = ({ updateDate }) => {
    const getTimeAgo = (updateDate) => {
        const startDateObject = new Date(updateDate);
        startDateObject.setMinutes(startDateObject.getMinutes() + 120);

        const timeDiff = Date.now() - startDateObject.getTime();

        if (timeDiff < 60000) {
            return `${Math.floor(timeDiff / 1000)} seconds ago`;
        } else if (timeDiff < 3600000) {
            return `${Math.floor(timeDiff / 60000)} minutes ago`;
        } else if (timeDiff < 86400000) {
            return `${Math.floor(timeDiff / 3600000)} hours ago`;
        } else if (timeDiff < 2592000000) {
            return `${Math.floor(timeDiff / 86400000)} days ago`;
        } else if (timeDiff < 31536000000) {
            return `${Math.floor(timeDiff / 2592000000)} months ago`;
        } else {
            return `${Math.floor(timeDiff / 31536000000)} years ago`;
        }
    };

    const timeAgo = getTimeAgo(updateDate);

    return timeAgo;
};

export const TimeToDate = ({ startDate }) => {
    const startDateObject = new Date(startDate);

    const year = startDateObject.getFullYear();
    const month = String(startDateObject.getMonth() + 1).padStart(2, '0'); 
    const day = String(startDateObject.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
};