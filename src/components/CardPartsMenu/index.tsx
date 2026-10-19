import DotsMenu from '../DotsMenu';

interface CardPartsMenuProps<T extends string> {
  options: { id: T; label: string; checked: boolean }[];
  onChange: (id: T, checked: boolean) => void;
}

// Chooses which parts the cards show. At least one stays checked: the last checked option can't be unticked.
const CardPartsMenu = <T extends string>({ options, onChange }: CardPartsMenuProps<T>) => {
  const checkedCount = options.filter((option) => option.checked).length;

  return (
    <DotsMenu label="Card options">
      <fieldset>
        <legend className="px-2 pt-1 text-sm font-bold text-ink-muted">Show on the cards</legend>
        {options.map(({ id, label, checked }) => (
          <label
            key={id}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-2 text-sm font-bold text-ink has-disabled:cursor-default has-disabled:opacity-50"
          >
            <input
              type="checkbox"
              className="size-4 cursor-[inherit] accent-brand"
              checked={checked}
              disabled={checked && checkedCount === 1}
              onChange={(event) => onChange(id, event.target.checked)}
            />
            {label}
          </label>
        ))}
      </fieldset>
    </DotsMenu>
  );
};

export default CardPartsMenu;
