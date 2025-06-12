import { ThreeDot } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="loading-container">
      <ThreeDot
        color="#2b915d"
        size={50}
        style={{ display: 'block', margin: '0 auto' }}
      />
      <p>Loading weather data...</p>
    </div>
  );
}
