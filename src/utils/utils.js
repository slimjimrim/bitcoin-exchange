function formatPrice(price) {
  const formatConfig = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatConfig.format(price);
}

function formatPlusMinus(priceChange) {
  const isPositive = Math.sign(priceChange) >= 0;

  return (
    <span className={`${isPositive ? 'positive' : 'negative'}`}>
      {`${isPositive ? '+' : ''}${priceChange.toFixed(2)}%`}
    </span>
  );
}

export {
  formatPrice,
  formatPlusMinus
}
