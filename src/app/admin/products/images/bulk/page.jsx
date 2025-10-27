'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

import { Stack, Button, MenuItem, TextField, Typography, LinearProgress } from '@mui/material';

export default function BulkProductImagesPage() {
  const [products, setProducts] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [mapTo, setMapTo] = useState({}); // publicId -> product_id
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchUnassigned = async () => {
    const res = await fetch('/api/admin/product-images/unassigned');
    const data = await res.json();
    const items = data?.items ?? [];
    setUnassigned(items);
    // simple auto-guess product_id from digits inside publicId (change if you prefer slug)
    const next = {};
    items.forEach((it) => {
      const m = (it.publicId || '').match(/(\d+)/);
      next[it.publicId] = m ? Number(m[1]) : '';
    });
    setMapTo(next);
  };

  useEffect(() => {
    fetchProducts();
    fetchUnassigned();
  }, []);

  const onBulkUpload = async () => {
    if (!files.length) { setMsg('Pick at least one image.'); return; }
    setBusy(true);
    setMsg('Uploading…');
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await fetch('/api/admin/product-images/bulk', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Bulk upload failed');
      setFiles([]);
      await fetchUnassigned();
      setMsg('✅ Uploaded to Cloudinary (products/). Now map them below.');
    } catch {
      setMsg('❌ Upload failed. Check file size/type and server logs.');
    } finally {
      setBusy(false);
    }
  };

  const linkOne = async (publicId) => {
    const product_id = mapTo[publicId];
    if (!product_id) { setMsg('Choose a product first.'); return; }
    setBusy(true);
    setMsg(`Linking ${publicId} → product ${product_id}…`);
    try {
      const res = await fetch(`/api/admin/products/${product_id}/image/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });
      if (!res.ok) throw new Error('Link failed');
      await Promise.all([fetchUnassigned(), fetchProducts()]);
      setMsg('✅ Linked.');
    } catch {
      setMsg('❌ Link failed. See server logs.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack spacing={4} sx={{ px: 4, py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Bulk Upload & Map Product Images</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="text" href="/admin/products/images">Go to Inline page</Button>
        </Stack>
      </Stack>

      {busy && <LinearProgress />}

      {/* Bulk upload */}
      <Stack spacing={1}>
        <Typography variant="h6">1) Upload to Cloudinary (folder: products/)</Typography>
        <Typography variant="body2" color="text.secondary">
          JPEG / PNG / WEBP, ≤ 5MB each. You can upload first and map later.
        </Typography>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={onBulkUpload} disabled={busy}>Upload</Button>
          <Button variant="outlined" onClick={fetchUnassigned} disabled={busy}>Refresh Unassigned</Button>
        </Stack>
        {msg && <Typography variant="body2" color="text.secondary">{msg}</Typography>}
      </Stack>

      {/* Map unassigned assets */}
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Typography variant="h6">2) Map unassigned images → product</Typography>
        {unassigned.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No unassigned images found. Upload above or try Refresh.
          </Typography>
        ) : (
          unassigned.map((it) => (
            <Stack key={it.publicId} direction="row" spacing={2} alignItems="center">
              <img
                src={it.url}
                alt={it.publicId}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, background: '#eee' }}
              />
              <code style={{ fontSize: 12 }}>{it.publicId}</code>

              <TextField
                select
                size="small"
                label="Map to product"
                value={mapTo[it.publicId] ?? ''}
                onChange={(e) => setMapTo((s) => ({ ...s, [it.publicId]: Number(e.target.value) }))}
                sx={{ minWidth: 320 }}
              >
                {products.map((p) => (
                  <MenuItem key={p.product_id} value={p.product_id}>
                    {p.product_id}. {p.name}
                  </MenuItem>
                ))}
              </TextField>

              <Button variant="outlined" size="small" onClick={() => linkOne(it.publicId)} disabled={busy}>
                Link
              </Button>
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
}
