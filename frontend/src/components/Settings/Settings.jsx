import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { MemoryContext } from '../../context/MemoryContext';
import { User, Mail, KeyRound, ShieldAlert, Trash2, LogOut, Cpu, Check } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user, updateProfile, deleteAccount, logout } = useContext(AuthContext);
  const { dbConnected } = useContext(MemoryContext);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Deletion Matrix States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    if (!username.trim() || !email.trim()) {
      setUpdateError('OPERATOR DETAILS CANNOT BE EMPTY SECTORS');
      return;
    }

    setIsUpdating(true);

    // Latency for high-tech sync feel
    setTimeout(async () => {
      const success = await updateProfile(username, email, password || null);
      setIsUpdating(false);
      if (success) {
        setUpdateSuccess(true);
        setPassword('');
        // Alert stays active for 4 seconds
        setTimeout(() => setUpdateSuccess(false), 4000);
      } else {
        setUpdateError('RECALIBRATION FAILED: CONFLICT DETECTED');
      }
    }, 1200);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError(null);

    if (deleteConfirmText !== 'PURGE') {
      setDeleteError('VALIDATION BREACH: INJECT EXACT PURGE DIRECTIVE');
      return;
    }

    setIsDeleting(true);

    setTimeout(async () => {
      const success = await deleteAccount();
      setIsDeleting(false);
      if (!success) {
        setDeleteError('PURGE DESTRUCTION ERROR: DATABASE LOCKED');
      }
    }, 1500);
  };

  return (
    <div className="settings-cyber-cockpit glass-panel">
      <div className="settings-headerhud hud-font">
        <Cpu size={16} className="settings-spin text-cyan" />
        <h2>OPERATOR SETTINGS MATRIX // ACCESS PROFILE 0x8E</h2>
      </div>

      <div className="settings-matrix-columns">
        {/* Left Column: Edit Details */}
        <div className="settings-column-card card-cyan">
          <h3 className="column-title hud-font">// CONFIGURE OPERATOR SIGNATURE</h3>
          <p className="column-subtitle">Recalibrate designation and coordinate parameters. Empty passcodes bypass modification loops.</p>

          <form onSubmit={handleUpdate} className="settings-form-matrix">
            <div className="settings-input-wrapper">
              <label className="hud-font">OPERATOR DESIGNATION</label>
              <div className="settings-input-group">
                <div className="settings-icon-box">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="settings-matrix-input"
                  placeholder="USERNAME"
                  disabled={isUpdating}
                  required
                />
              </div>
            </div>

            <div className="settings-input-wrapper">
              <label className="hud-font">UPLINK COORDINATE (EMAIL)</label>
              <div className="settings-input-group">
                <div className="settings-icon-box">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="settings-matrix-input"
                  placeholder="EMAIL"
                  disabled={isUpdating}
                  required
                />
              </div>
            </div>

            <div className="settings-input-wrapper">
              <label className="hud-font">NEW ACCESS DECRYPTION PASSCODE</label>
              <div className="settings-input-group">
                <div className="settings-icon-box">
                  <KeyRound size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="settings-matrix-input"
                  placeholder="LEAVE EMPTY TO RETAIN CURRENT ACCESS CODE"
                  disabled={isUpdating}
                />
              </div>
            </div>

            {updateError && (
              <div className="settings-alert-box error hud-font">
                <ShieldAlert size={14} />
                <span>{updateError.toUpperCase()}</span>
              </div>
            )}

            {updateSuccess && (
              <div className="settings-alert-box success hud-font">
                <Check size={14} />
                <span>OPERATOR PROFILE SECURELY RECALIBRATED</span>
              </div>
            )}

            <button 
              type="submit" 
              className="settings-submit-btn btn-cyan-glow hud-font"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="loader-inner">
                  <Cpu size={14} className="settings-spin" />
                  <span>SYNCING DIRECTIVES...</span>
                </div>
              ) : (
                <span>UPDATE SECURE SIGNATURE</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Destructive Actions & Log Out */}
        <div className="settings-column-card card-magenta">
          <h3 className="column-title hud-font text-magenta">// TERMINATION PROCEDURES</h3>
          <p className="column-subtitle">Execute administrative overrides. Account purges permanently wipe your database notes footprint.</p>

          <div className="destructive-controls-box">
            {/* General Log out block */}
            <div className="profile-action-segment border-glow-pink">
              <div className="segment-info">
                <h4 className="hud-font text-magenta">DISCONNECT COGNITIVE UPLINK</h4>
                <p>Purge session JWT indices from browser cache. Safely return core server to standby.</p>
              </div>
              <button 
                type="button" 
                className="action-trigger-btn btn-pink-outline hud-font"
                onClick={logout}
              >
                <LogOut size={14} style={{ marginRight: '6px' }} />
                PURGE SESSION
              </button>
            </div>

            {/* Critical Delete Account block */}
            <div className="profile-action-segment border-glow-red">
              <div className="segment-info">
                <h4 className="hud-font text-red">DESTRUCTIVE SECTOR PURGE</h4>
                <p>Erase operator node from MongoDB. Permanently wipe all matching saved capsules from storage cores.</p>
              </div>
              
              {!showDeleteConfirm ? (
                <button 
                  type="button" 
                  className="action-trigger-btn btn-red-filled hud-font"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={14} style={{ marginRight: '6px' }} />
                  PURGE OPERATOR
                </button>
              ) : (
                <div className="critical-delete-handshake panel-threat">
                  <div className="threat-header hud-font">
                    <ShieldAlert size={14} />
                    <span>SEVERE THREAT CRITICAL INDEX</span>
                  </div>
                  <p className="threat-warning">This operation is irreversible! To authorize account deletion and memory grid wipes, type "PURGE" below:</p>
                  
                  <form onSubmit={handleDeleteAccount} className="threat-form-matrix">
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="ENTER PURGE INDICES"
                      className="threat-validation-input hud-font"
                      disabled={isDeleting}
                      required
                    />

                    {deleteError && (
                      <div className="settings-alert-box error hud-font" style={{ marginTop: '5px' }}>
                        <ShieldAlert size={14} />
                        <span>{deleteError.toUpperCase()}</span>
                      </div>
                    )}

                    <div className="threat-btn-row">
                      <button 
                        type="button" 
                        className="threat-cancel-btn hud-font"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                          setDeleteError(null);
                        }}
                        disabled={isDeleting}
                      >
                        [ CANCEL ]
                      </button>
                      
                      <button 
                        type="submit" 
                        className="threat-destructive-btn hud-font"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <span>ERASING ALL MEMORY CORES...</span>
                        ) : (
                          <span>[ PURGE ACCOUNT ]</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
