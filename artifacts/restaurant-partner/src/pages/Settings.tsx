import { useState } from "react";
import { SectionPanel } from "@/components/SectionPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { restaurantProfile } from "@/lib/mockData";
import { toast } from "sonner";

export default function Settings() {
  const [profile, setProfile] = useState(restaurantProfile);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-7 space-y-4">
        <SectionPanel title="Restaurant details" subtitle="Public information shown to customers.">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} data-testid="input-restaurant-name" />
            </div>
            <div className="space-y-1.5">
              <Label>Cuisine</Label>
              <Input value={profile.cuisine} onChange={(e) => setProfile({ ...profile, cuisine: e.target.value })} data-testid="input-cuisine" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} data-testid="input-phone" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Address</Label>
              <Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} data-testid="input-address" />
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Working hours" subtitle="Open / close per day. Toggle off for closed days.">
          <div className="space-y-2">
            {profile.hours.map((h, i) => (
              <div key={h.day} className="grid grid-cols-12 items-center gap-2" data-testid={`hours-${h.day}`}>
                <div className="col-span-2 text-sm font-medium">{h.day}</div>
                <div className="col-span-4">
                  <Input
                    type="time"
                    value={h.open}
                    onChange={(e) => {
                      const next = profile.hours.slice();
                      next[i] = { ...h, open: e.target.value };
                      setProfile({ ...profile, hours: next });
                    }}
                    disabled={h.closed}
                    data-testid={`input-open-${h.day}`}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="time"
                    value={h.close}
                    onChange={(e) => {
                      const next = profile.hours.slice();
                      next[i] = { ...h, close: e.target.value };
                      setProfile({ ...profile, hours: next });
                    }}
                    disabled={h.closed}
                    data-testid={`input-close-${h.day}`}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className="text-xs text-muted-foreground">{h.closed ? "Closed" : "Open"}</span>
                  <Switch
                    checked={!h.closed}
                    onCheckedChange={(v) => {
                      const next = profile.hours.slice();
                      next[i] = { ...h, closed: !v };
                      setProfile({ ...profile, hours: next });
                    }}
                    data-testid={`switch-day-${h.day}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      <div className="col-span-12 md:col-span-5 space-y-4">
        <SectionPanel title="Bank info" subtitle="Where your payouts land.">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Account holder</Label>
              <Input value={profile.bank.holder} onChange={(e) => setProfile({ ...profile, bank: { ...profile.bank, holder: e.target.value } })} data-testid="input-bank-holder" />
            </div>
            <div className="space-y-1.5">
              <Label>Account number</Label>
              <Input value={profile.bank.accountMasked} disabled data-testid="input-bank-account" />
            </div>
            <div className="space-y-1.5">
              <Label>Routing</Label>
              <Input value={profile.bank.routing} onChange={(e) => setProfile({ ...profile, bank: { ...profile.bank, routing: e.target.value } })} data-testid="input-bank-routing" />
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Save changes">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Updates apply immediately across the app.</p>
            <Button
              className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
              onClick={() => toast.success("Settings saved")}
              data-testid="button-save-settings"
            >
              Save
            </Button>
          </div>
        </SectionPanel>
      </div>
    </div>
  );
}
