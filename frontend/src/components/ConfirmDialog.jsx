import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

/**
 * Generic confirmation dialog
 * Props: open, title, message, confirmLabel, confirmColor, onConfirm, onCancel
 */
const ConfirmDialog = ({
    open,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    confirmColor = '#ef4444',
    onConfirm,
    onCancel,
    icon: Icon = AlertTriangle,
    iconColor = 'text-red-400',
    iconBg = 'rgba(239,68,68,0.12)',
    iconBorder = 'rgba(239,68,68,0.25)',
}) => (
    <AnimatePresence>
        {open && (
            <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, y: 16 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
                    style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
                >
                    <div className="p-6 flex flex-col items-center text-center gap-4">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.08 }}
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                        >
                            <Icon size={26} className={iconColor} />
                        </motion.div>

                        <div>
                            <p className="text-white font-bold text-lg">{title}</p>
                            <p className="text-gray-400 text-sm mt-1 leading-relaxed">{message}</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 w-full mt-1">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-300 transition-all hover:bg-white/10"
                                style={{ border: '1px solid #1e2d4a' }}
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={onConfirm}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                                style={{
                                    background: confirmColor,
                                    boxShadow: `0 4px 16px ${confirmColor}55`,
                                }}
                            >
                                {confirmLabel}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
)

export default ConfirmDialog
