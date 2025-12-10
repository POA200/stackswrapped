export default function CardPage({ params }: { params: { cardId: string } }) {
  return <div>Card: {params.cardId}</div>;
}
