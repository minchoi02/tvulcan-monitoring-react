export default function StatusBadge({status}){const c=status==='정상'?'ok':status==='주의'?'warn':'danger';return <span className={`status-badge ${c}`}>{status}</span>}
