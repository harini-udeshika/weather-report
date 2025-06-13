import { ThreeDot } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="loading-container">
      <ThreeDot
        color="#c8e6e5"
        size={50}
        style={{ display: 'block', margin: '0 auto' }}
      />
      <p>Loading weather data...</p>
    </div>
  );
}
