import React, { useState, useEffect } from "react";
import axios from "axios";
import nationalitiesData from "./utils/nationality.json"

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    Departure_city: "",
    Arrival_city: "",
    Travel_date:"",
    Return_date:"",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [nationalities, setNationalities] = useState([]);

  useEffect(() => {
    // Set the nationalities data to the state
    setNationalities(nationalitiesData);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  //phone no format

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number.");
      return false;
    }

    setError("");
    return true;
  };

  // Return date must be > travel date
  const validateDates = (travelDate, returnDate) => {
    if (travelDate && returnDate) {
      const travel = new Date(travelDate);
      const returnD = new Date(returnDate);
  
      if (returnD < travel) {
        setError("Return date must be later than the travel date.");
        return false;
      }
    }
    setError("");
    return true;
  };
  

 // sumbit the response
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (!validateForm()) return;
    try {
      // SERVER
      await axios.post("https://back-end-orcin-gamma.vercel.app/api/surveys/submit", formData);
      //LOCAL HOST
      // await axios.post("http://localhost:5000/api/surveys/submit", formData);
      setSuccess(true);
      setTimeout(()=>{
        setSuccess(false);
      },3000)
      setFormData({
        name: "",
        gender: "",
        nationality: "",
        email: "",
        phone: "",
        Departure_city: "",
        Arrival_city: "",
        Travel_date:"",
        Return_date:"",

      });
    } catch (err) {
      alert("Error submitting form: " + err.message);
    }
  };

  return (
    <div className="form-container">
      <h1>TRAVEL FORM</h1>
      {success && <p className="success-message">Form submitted successfully!</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
<input
  id="name"
  name="name"
  placeholder="Name"
  value={formData.name}
  onChange={handleChange}
  required
/>

<label htmlFor="gender">Gender:</label>
<select
  id="gender"
  name="gender"
  placeholder="Gender"
  value={formData.gender}
  onChange={handleChange}
  required
>
  <option value="" disabled>
    Select Gender
  </option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>

<div>
  <label htmlFor="nationality">Nationality:</label>
  <select
    id="nationality"
    name="nationality"
    placeholder="Nationality"
    value={formData.nationality}
    onChange={handleChange}
    required
  >
    <option value="" disabled>
      Select Nationality
    </option>
    {nationalities.map((nationality) => (
      <option key={nationality.id} value={nationality.value}>
        {nationality.value}
      </option>
    ))}
  </select>
</div>

<label htmlFor="email">Email:</label>
<input
  id="email"
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
  required
/>

<label htmlFor="phone">Phone:</label>
<input
  id="phone"
  type="tel"
  name="phone"
  placeholder="Phone"
  value={formData.phone}
  onChange={handleChange}
  required
/>

<label htmlFor="departure_city">Departure City:</label>
<input
  id="departure_city"
  name="Departure_city"
  placeholder="Departure City"
  value={formData.Departure_city}
  onChange={handleChange}
  required
/>

<label htmlFor="arrival_city">Arrival City:</label>
<input
  id="arrival_city"
  name="Arrival_city"
  placeholder="Arrival City"
  value={formData.Arrival_city}
  onChange={handleChange}
  required
/>
<label htmlFor="Travel Date">Travel Date:</label>
<input
  type="date"
  name="Travel_date"
  placeholder="Travel Date"
  value={formData.Travel_date}
  onChange={(e) => {
    handleChange(e);
    validateDates(e.target.value, formData.Return_date);
  }}
  required
/>

<label htmlFor="Return Date">Return Date:</label>
<input
  type="date"
  name="Return_date"
  placeholder="Return Date"
  value={formData.Return_date}
  onChange={(e) => {
    handleChange(e);
    validateDates(formData.Travel_date, e.target.value);
  }}
  required
/>
{error && <p className="error-message">{error}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SurveyForm;
