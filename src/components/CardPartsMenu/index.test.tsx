import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CardPartsMenu from '.';

const renderMenu = (checked = { thai: true, burmese: true }) => {
  const onChange = vi.fn();
  render(
    <CardPartsMenu
      options={[
        { id: 'thai', label: 'Thai', checked: checked.thai },
        { id: 'burmese', label: 'Burmese', checked: checked.burmese },
      ]}
      onChange={onChange}
    />
  );
  return { onChange };
};

const openMenu = () => userEvent.click(screen.getByRole('button', { name: 'Card options' }));

describe('CardPartsMenu', () => {
  it('lists the parts under the legend in a menu', async () => {
    renderMenu();

    await openMenu();

    const group = screen.getByRole('group', { name: 'Show on the cards' });

    expect(within(group).getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.getByRole('checkbox', { name: 'Thai' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Burmese' })).toBeChecked();
  });

  it('reports a change', async () => {
    const { onChange } = renderMenu();
    await openMenu();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Burmese' }));

    expect(onChange).toHaveBeenCalledWith('burmese', false);
  });

  describe('given only one part is checked', () => {
    it('keeps it from being unticked', async () => {
      renderMenu({ thai: true, burmese: false });

      await openMenu();

      expect(screen.getByRole('checkbox', { name: 'Thai' })).toBeDisabled();
      expect(screen.getByRole('checkbox', { name: 'Burmese' })).toBeEnabled();
    });
  });
});
