"use client";

export default function MobileSearch({ placeholder = "Rechercher un service…" }: { placeholder?: string }) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const products = document.getElementById("products");
    if (products) products.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mobile-search">
      <div className="container">
        <form className="search" onSubmit={handleSearch}>
          <div className="search-input"><input type="search" placeholder={placeholder} /></div>
          <button type="submit" className="search-btn"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
      </div>
    </div>
  );
}
