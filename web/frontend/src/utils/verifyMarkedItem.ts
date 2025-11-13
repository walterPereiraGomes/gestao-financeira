type ItemComId = { id?: string };

export default function verifyMarkedItem<T extends ItemComId>(
  markedItems: T[],
  listItem: T
): boolean {
  if (!markedItems || markedItems.length === 0) return false;
  return markedItems.some(item => item.id === listItem.id);
}
