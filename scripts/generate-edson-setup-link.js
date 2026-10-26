#!/usr/bin/env node
// ==============================================================================
// SCRIPT DE SEED / GERAÇÃO DO LINK EXCLUSIVO DE AUTOATIVAÇÃO DO ÉDSON
// Uso: node scripts/generate-edson-setup-link.js
// ==============================================================================

import crypto from 'crypto';
import { loadGovernanceState, saveGovernanceState, sha256 } from '../api/_governance.js';

async function main() {
  const randomKey = `EDSON-${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
  const tokenHash = sha256(randomKey);
  const expiresAt = null; // Vitalício / Sempre Confiável (Sem expiração)

  const { state, sha } = await loadGovernanceState(true);
  state.admin_setup_tokens.unshift({
    id: crypto.randomUUID(),
    user_id: '99999999-9999-9999-9999-999999999999',
    token_hash: tokenHash,
    email_code_hash: null,
    phone_code_hash: null,
    pending_email: null,
    pending_phone: null,
    pending_password_hash: null,
    is_used: false,
    expires_at: null,
    created_at: new Date().toISOString()
  });

  await saveGovernanceState(state, sha, 'Seed Edson setup-admin link');

  const baseUrl = process.env.CRM_BASE_URL || 'https://crm-piff-paff-v2.vercel.app';
  console.log('==============================================================================');
  console.log('👑 LINK EXCLUSIVO DE AUTOATIVAÇÃO DO SUPER ADMIN (ÉDSON) GERADO COM SUCESSO!');
  console.log('==============================================================================');
  console.log(`🔑 Token Gerado:   ${randomKey}`);
  console.log(`🔒 Hash SHA-256:   ${tokenHash}`);
  console.log(`♾️ Expiração:      NUNCA EXPIRA (Sempre Confiável)`);
  console.log(`🌐 URL Produção:   ${baseUrl}/setup-admin?token=${randomKey}`);
  console.log(`💻 URL Local:      http://localhost:3000/setup-admin?token=${randomKey}`);
  console.log(`🛡️ URL Master Fixa: ${baseUrl}/setup-admin?token=edson_setup_2026_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c`);
  console.log('==============================================================================');
}

main().catch(err => {
  console.error('Erro ao gerar link:', err);
  process.exit(1);
});
