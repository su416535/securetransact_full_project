export function Input({ className = "", ...props }) {
    return (
      <input
        className={`w-full p-2 border border-gray-300 rounded ${className}`}
        {...props}
      />
    );
  }
  