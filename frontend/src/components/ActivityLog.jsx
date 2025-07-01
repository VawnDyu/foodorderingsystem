import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import styles from './ActivityLog.module.css';
import { FiClock } from 'react-icons/fi';

export default function ActivityLog() {
  const userId = useSelector((state) => state.user.user._id);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`/user/${userId}/activity-logs`, {
          withCredentials: true,
        });
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching activity logs:', err);
      } finally {
        setLoading(false); // Stop loading in either case
      }
    };

    if (userId) fetchLogs();
  }, [userId]);

  return (
    <div className={styles.container}>
      {loading ? (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
      ) : logs.length === 0 ? (
        <div className={styles.noLogsContainer}>
          <span><FiClock size={22} /></span>
          <p>No activity logs yet.</p>
        </div>
      ) : (
        <ul className={styles.logList}>
          {logs.map((log) => (
            <li key={log._id} className={styles.logItem}>
              <span className={styles.icon}><FiClock size={18} /></span>
              <span className={styles.date}>
                {new Date(log.date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </span>
              <span className={styles.message}>{log.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
