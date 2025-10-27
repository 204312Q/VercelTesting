// app/admin/products/images/page.jsx
// Inline table + “Pick from Media Library”

'use client';

export const dynamic = 'force-dynamic';

import Script from 'next/script';
import React, { useState, useEffect } from 'react';

import { Stack, Table, Button, TableRow, TableBody, TableCell, TableHead, Typography } from '@mui/material';

export default function AdminProductImagesPage() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/products');
      setRows(await res.json());
    })();
  }, []);

  const replaceInline = async (product_id, file) => {
    setBusy(true);
    const fd = new FormData();
    fd.append('file', file);
    await fetch(`/api/admin/products/${product_id}/image`, { method: 'POST', body: fd });
    setBusy(false);
    const res = await fetch('/api/admin/products');
    setRows(await res.json());
  };

  const removeImage = async (product_id) => {
    setBusy(true);
    await fetch(`/api/admin/products/${product_id}/image`, { method: 'DELETE' });
    setBusy(false);
    const res = await fetch('/api/admin/products');
    setRows(await res.json());
  };

  const pickFromMediaLibrary = (product_id) => {
    if (!window.cloudinary) {
        alert('Media Library not loaded yet. Try again in a moment.');
        return;
    }

    window.cloudinary.openMediaLibrary(
      {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, // or use signed config
        multiple: false,
        max_files: 1,
        folder: { path: 'products', resource_type: 'image' },
        insert_caption: 'Use this image',
      },
      {
        insertHandler: async ({ assets }) => {
          const asset = assets && assets[0];
          if (!asset) return;
          await fetch(`/api/admin/products/${product_id}/image/link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId: asset.public_id }),
          });
          const res = await fetch('/api/admin/products');
          setRows(await res.json());
        },
      }
    );
  };

  return (
    <Stack spacing={2} sx={{ px: 4, py: 5 }}>
      {/* Load Cloudinary ML widget on this page only */}
      <Script src="https://media-library.cloudinary.com/global/all.js" strategy="afterInteractive" />

      <Button variant="text" href="/admin/products/images/bulk">Bulk upload & map</Button>

      <Typography variant="h4">Product Images</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((p) => (
            <TableRow key={p.product_id}>
              <TableCell>{p.product_id}</TableCell>
              <TableCell style={{ width: 96 }}>
                <img
                  src={p.imageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
                  alt={p.name}
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, background: '#eee' }}
                />
              </TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id={`file-${p.product_id}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) replaceInline(p.product_id, file);
                  }}
                />
                <label htmlFor={`file-${p.product_id}`}>
                  <Button size="small" variant="outlined" component="span" disabled={busy}>Replace</Button>
                </label>
                &nbsp;
                <Button size="small" onClick={() => pickFromMediaLibrary(p.product_id)} disabled={busy}>Pick</Button>
                &nbsp;
                <Button size="small" color="error" onClick={() => removeImage(p.product_id)} disabled={busy || !p.imageUrl}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
