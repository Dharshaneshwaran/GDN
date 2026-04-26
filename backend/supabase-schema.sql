create extension if not exists "pgcrypto";

create table outward_entries (
  id uuid primary key default gen_random_uuid(),
  party_name text not null,
  process_type text not null,
  fabric_type text not null,
  lot_number text not null unique,
  sent_weight numeric not null check (sent_weight > 0),
  sent_date date not null,
  vehicle_number text,
  driver_name text,
  allowed_loss_percent numeric not null default 0 check (allowed_loss_percent >= 0),
  remarks text,
  created_at timestamp with time zone default now()
);

create table inward_entries (
  id uuid primary key default gen_random_uuid(),
  outward_entry_id uuid not null references outward_entries(id) on delete cascade,
  received_weight numeric not null check (received_weight > 0),
  received_date date not null,
  received_by text,
  remarks text,
  expected_received_weight numeric,
  shortage numeric,
  status text,
  whatsapp_alert_message text,
  whatsapp_alert_url text,
  created_at timestamp with time zone default now()
);
