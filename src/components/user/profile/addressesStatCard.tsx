interface AddressesStatCardProps {
  totalAddresses: number;
}

const AddressesStatCard = ({ totalAddresses }: AddressesStatCardProps) => (
  <div className="rounded-lg border bg-card p-3 text-center">
    <p className="text-xs text-muted-foreground">Addresses</p>
    <p className="text-xl font-semibold">{totalAddresses}</p>
  </div>
);

export default AddressesStatCard;
