export default function EmptyState({ icon = "📭", title, desc, action }) {
  return (
    <tr>
      <td colSpan={99}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">{title}</h3>
          <p className="text-gray-400 text-sm mb-4">{desc}</p>
          {action && action}
        </div>
      </td>
    </tr>
  );
}
