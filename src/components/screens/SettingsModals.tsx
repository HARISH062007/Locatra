"use client";

import { useState } from "react";
import { GlassModal, GlassButton, GlassInput } from "@/components/ui";
import { useSettingsStore } from "@/store/settingsStore";
import { useToast } from "@/components/ui/ToastProvider";
import { Check, ShieldAlert, Trash2, DownloadCloud, AlertTriangle } from "lucide-react";

export type ModalType = 
  | 'edit_name' | 'edit_email' | 'edit_phone' | 'change_password' | 'connected_accounts' 
  | 'manage_houses' | 'home_address' | 'export_data' | 'delete_account' 
  | 'manage_storage' | 'feedback' | 'sign_out' | 'terms' | 'privacy' | 'licenses' | 'support' 
  | null;

interface SettingsModalsProps {
  activeModal: ModalType;
  onClose: () => void;
}

export function SettingsModals({ activeModal, onClose }: SettingsModalsProps) {
  const store = useSettingsStore();
  const { toast } = useToast();

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <EditNameModal isOpen={activeModal === 'edit_name'} onClose={handleClose} store={store} toast={toast} />
      <EditEmailModal isOpen={activeModal === 'edit_email'} onClose={handleClose} store={store} toast={toast} />
      <EditPhoneModal isOpen={activeModal === 'edit_phone'} onClose={handleClose} store={store} toast={toast} />
      <ChangePasswordModal isOpen={activeModal === 'change_password'} onClose={handleClose} toast={toast} />
      <ConnectedAccountsModal isOpen={activeModal === 'connected_accounts'} onClose={handleClose} store={store} toast={toast} />
      <ExportDataModal isOpen={activeModal === 'export_data'} onClose={handleClose} store={store} toast={toast} />
      <DeleteAccountModal isOpen={activeModal === 'delete_account'} onClose={handleClose} toast={toast} />
      <SignOutModal isOpen={activeModal === 'sign_out'} onClose={handleClose} />
      
      <ManageHousesModal isOpen={activeModal === 'manage_houses'} onClose={handleClose} store={store} toast={toast} />
      <HomeAddressModal isOpen={activeModal === 'home_address'} onClose={handleClose} store={store} toast={toast} />
      <ManageStorageModal isOpen={activeModal === 'manage_storage'} onClose={handleClose} toast={toast} />
      <FeedbackModal isOpen={activeModal === 'feedback'} onClose={handleClose} toast={toast} />
      
      <GenericTextModal 
        isOpen={['terms', 'privacy', 'licenses', 'support'].includes(activeModal as string)} 
        type={activeModal as 'terms' | 'privacy' | 'licenses' | 'support'} 
        onClose={handleClose} 
      />
    </>
  );
}

// --- Individual Modals ---

function EditNameModal({ isOpen, onClose, store, toast }: any) {
  const [name, setName] = useState(store.name);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    store.updateProfile({ name: name.trim() });
    toast({ title: "Profile Updated", message: "Your name has been successfully changed.", type: "success" });
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Edit Name</h3>
      <div className="flex flex-col gap-4">
        <GlassInput 
          label="Full Name" 
          value={name} 
          onChange={(e) => { setName(e.target.value); setError(""); }} 
        />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <GlassButton variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Cancel</GlassButton>
          <GlassButton variant="primary" onClick={handleSave}>Save Changes</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

function EditEmailModal({ isOpen, onClose, store, toast }: any) {
  const [email, setEmail] = useState(store.email);
  const [error, setError] = useState("");

  const handleSave = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    store.updateProfile({ email });
    toast({ title: "Email Verification Sent", message: "Check your inbox to verify your new email.", type: "info" });
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Edit Email Address</h3>
      <div className="flex flex-col gap-4">
        <GlassInput 
          label="Email Address" 
          type="email"
          value={email} 
          onChange={(e) => { setEmail(e.target.value); setError(""); }} 
        />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <GlassButton variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Cancel</GlassButton>
          <GlassButton variant="primary" onClick={handleSave}>Update Email</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

function EditPhoneModal({ isOpen, onClose, store, toast }: any) {
  const [phone, setPhone] = useState(store.phone);

  const handleSave = () => {
    store.updateProfile({ phone });
    toast({ title: "Phone Updated", message: "Your phone number has been updated.", type: "success" });
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Edit Phone Number</h3>
      <div className="flex flex-col gap-4">
        <GlassInput 
          label="Phone Number" 
          type="tel"
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
        />
        <div className="flex justify-end gap-3 mt-4">
          <GlassButton variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Cancel</GlassButton>
          <GlassButton variant="primary" onClick={handleSave}>Save Changes</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

function ChangePasswordModal({ isOpen, onClose, toast }: any) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (newPass.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPass !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    toast({ title: "Security Updated", message: "Your password has been changed successfully.", type: "success" });
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Change Password</h3>
      </div>
      <div className="flex flex-col gap-4">
        <GlassInput label="Current Password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <GlassInput label="New Password" type="password" value={newPass} onChange={(e) => { setNewPass(e.target.value); setError(""); }} />
        <GlassInput label="Confirm New Password" type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <GlassButton variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Cancel</GlassButton>
          <GlassButton variant="primary" onClick={handleSave}>Update Password</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

function ConnectedAccountsModal({ isOpen, onClose, store, toast }: any) {
  const [accounts, setAccounts] = useState<string[]>(store.connectedAccounts);

  const toggleAccount = (account: string) => {
    if (accounts.includes(account)) {
      setAccounts(accounts.filter(a => a !== account));
      toast({ title: "Account Disconnected", message: `Your ${account} account was disconnected.`, type: "info" });
    } else {
      setAccounts([...accounts, account]);
      toast({ title: "Account Connected", message: `Your ${account} account was successfully connected.`, type: "success" });
    }
  };

  const handleSave = () => {
    store.updateProfile({ connectedAccounts: accounts });
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Connected Accounts</h3>
      <div className="flex flex-col gap-3">
        {['Google', 'Apple', 'Microsoft'].map(provider => (
          <div key={provider} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{provider}</span>
            <button 
              onClick={() => toggleAccount(provider)}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full border transition-colors ${
                accounts.includes(provider) 
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400' 
                  : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400'
              }`}
            >
              {accounts.includes(provider) ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
        <div className="flex justify-end gap-3 mt-4">
          <GlassButton variant="primary" onClick={handleSave}>Done</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

function ExportDataModal({ isOpen, onClose, store, toast }: any) {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "locatra_data_export.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Export Complete", message: "Your data has been downloaded as a JSON file.", type: "success" });
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <DownloadCloud className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Export My Data</h3>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
        Download a complete JSON backup of all your personal data, homes, rooms, items, and settings stored in Locatra.
      </p>
      <div className="flex justify-end gap-3">
        <GlassButton variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Cancel</GlassButton>
        <GlassButton variant="primary" onClick={handleExport}>Download JSON</GlassButton>
      </div>
    </GlassModal>
  );
}

function DeleteAccountModal({ isOpen, onClose, toast }: any) {
  const [confirm, setConfirm] = useState("");

  const handleDelete = () => {
    if (confirm !== "DELETE") return;
    toast({ title: "Account Deleted", message: "Your account and data have been permanently removed.", type: "error" });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} className="border-red-500/20 dark:border-red-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Account</h3>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-6">
        This action is irreversible. All your homes, rooms, spatial scans, and settings will be permanently erased. Please type <strong>DELETE</strong> to confirm.
      </p>
      <div className="flex flex-col gap-4">
        <GlassInput 
          placeholder="Type DELETE" 
          value={confirm} 
          onChange={(e) => setConfirm(e.target.value)} 
          className="border-red-200 dark:border-red-900/50 focus:border-red-500"
        />
        <div className="flex justify-end gap-3 mt-2">
          <GlassButton variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Cancel</GlassButton>
          <GlassButton 
            variant="primary" 
            onClick={handleDelete} 
            className={`bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] ${confirm !== 'DELETE' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={confirm !== 'DELETE'}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Permanently Delete
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

function SignOutModal({ isOpen, onClose }: any) {
  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sign Out</h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
        Are you sure you want to sign out of Locatra? You will need to sign in again to access your spaces.
      </p>
      <div className="flex justify-end gap-3">
        <GlassButton variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Cancel</GlassButton>
        <GlassButton variant="primary" onClick={handleSignOut}>Sign Out</GlassButton>
      </div>
    </GlassModal>
  );
}

function ManageHousesModal({ isOpen, onClose, toast }: any) {
  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Manage Houses</h3>
      <p className="text-sm text-slate-500 mb-4">You can create, duplicate, or delete your spatial environments here.</p>
      <div className="flex flex-col gap-2 mb-6">
        {['Main Residence', 'Lake House', 'Office Space'].map((h, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <span className="font-medium text-slate-700 dark:text-slate-300">{h}</span>
            <div className="flex gap-2">
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800">Edit</button>
              <button className="text-xs font-bold text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-3">
        <GlassButton variant="ghost" onClick={onClose} className="border border-slate-200 dark:border-white/10">Done</GlassButton>
        <GlassButton variant="primary">Create New House</GlassButton>
      </div>
    </GlassModal>
  );
}

function HomeAddressModal({ isOpen, onClose, store, toast }: any) {
  const [address, setAddress] = useState(store.homeAddress);

  const handleSave = () => {
    store.updateSetting('homeAddress', address);
    toast({ title: "Address Saved", message: "Your home address has been updated.", type: "success" });
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Home Address</h3>
      <div className="flex flex-col gap-4">
        <GlassInput 
          label="Street Address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          placeholder="e.g. 123 Apple Park Way, Cupertino, CA"
        />
        <div className="flex justify-end gap-3 mt-4">
          <GlassButton variant="ghost" onClick={onClose} className="border border-slate-200 dark:border-white/10">Cancel</GlassButton>
          <GlassButton variant="primary" onClick={handleSave}>Save Address</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

function ManageStorageModal({ isOpen, onClose, toast }: any) {
  const handleClear = (type: string) => {
    toast({ title: "Storage Cleared", message: `Successfully cleared all ${type}.`, type: "success" });
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Manage Storage</h3>
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <div>
            <div className="font-semibold text-slate-700 dark:text-slate-300">Clear Cache</div>
            <div className="text-xs text-slate-500">Frees up temporary space (450 MB)</div>
          </div>
          <GlassButton variant="ghost" onClick={() => handleClear("cache")} className="text-xs py-1.5 px-3">Clear</GlassButton>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <div>
            <div className="font-semibold text-slate-700 dark:text-slate-300">Delete Old Scans</div>
            <div className="text-xs text-slate-500">Remove scans older than 6 months (1.2 GB)</div>
          </div>
          <GlassButton variant="ghost" onClick={() => handleClear("old scans")} className="text-xs py-1.5 px-3 text-red-500">Delete</GlassButton>
        </div>
      </div>
      <div className="flex justify-end">
        <GlassButton variant="primary" onClick={onClose}>Done</GlassButton>
      </div>
    </GlassModal>
  );
}

function FeedbackModal({ isOpen, onClose, toast }: any) {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (!msg) return;
    toast({ title: "Feedback Sent", message: "Thank you for helping us improve Locatra!", type: "success" });
    setMsg("");
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Send Feedback</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Message</label>
          <textarea 
            rows={4}
            value={msg}
            onChange={e => setMsg(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/20 border border-white/60 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition-all shadow-sm"
            placeholder="Tell us what you think..."
          />
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <GlassButton variant="ghost" onClick={onClose} className="border border-slate-200 dark:border-white/10">Cancel</GlassButton>
          <GlassButton variant="primary" onClick={handleSend}>Send</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

function GenericTextModal({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'terms' | 'privacy' | 'licenses' | 'support' }) {
  const content = {
    terms: { title: "Terms of Service", body: "By using Locatra, you agree to our terms. Your spatial data is yours, but do not use our app for illegal scanning activities." },
    privacy: { title: "Privacy Policy", body: "We take your privacy seriously. All 3D room data is processed securely. We do not sell your spatial models to third parties." },
    licenses: { title: "Open Source Licenses", body: "Locatra uses several open source libraries including React, Tailwind CSS, Framer Motion, and Zustand. We thank the open source community." },
    support: { title: "Contact Support", body: "Need help? Email us at support@locatra.ai or call 1-800-LOCATRA between 9 AM and 5 PM EST." }
  };
  
  if (!type || !content[type]) return null;

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{content[type].title}</h3>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
        {content[type].body}
      </p>
      <div className="flex justify-end">
        <GlassButton variant="primary" onClick={onClose}>Close</GlassButton>
      </div>
    </GlassModal>
  );
}
