import React from "react";

const BookingInfo = ({ book, date }) => {
  const [bookings, setBookings] = React.useState([]);

  React.useEffect(() => {
    book &&
      fetch("https://bus-counter-backend-production.up.railway.app/booking/all")
        .then((res) => res.json())
        .then((data) => {
          const dataFilter = data.filter(
            (item) =>
              item.trip_date === date &&
              item.trip_name === book.trip_name &&
              item.trip_time === book.trip_time
          );
          setBookings(dataFilter);
        })
        .catch((err) => console.log(err));
  }, [book, date]);
  return (
    <div>
      {bookings.length > 0 && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">গন্তব্য</th>
                <th scope="col">সিট নম্বর</th>
                <th scope="col">টোটাল ভাড়া</th>
              </tr>
            </thead>
            <tbody>
              {bookings &&
                bookings?.map((date, index) => (
                  <tr key={index}>
                    <td>
                      {date.trip_from} - {date.trip_to}
                    </td>
                    <td>
                      {date.sit_selected?.map((sit, index) => (
                        <span key={index}>{sit}, </span>
                      ))}
                    </td>
                    <td>{date.grand_total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingInfo;
