import { useEffect, useState } from "react";
import { SectionPanel } from "@/components/SectionPanel";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export default function Settings() {
  const { restaurantProfile, updateRestaurantProfile } = useStore();
  const [profile, setProfile] = useState(restaurantProfile);

  useEffect(() => {
    if (restaurantProfile) {
      setProfile(restaurantProfile);
    }
  }, [restaurantProfile]);

  if (!profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        Loading profile matrix configuration parameters...
      </div>
    );
  }
  const handleSaveChanges = async () => {
    try {
      await updateRestaurantProfile(profile);
      toast.success("Settings saved and synced with MongoDB cloud clusters.");
    } catch (err) {
      toast.error("Failed to persist changes across cloud infrastructure.");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Settings"
        description="Restaurant profile, working hours, and payout details. Changes apply across every page in real time."
        actions={
          <Button
            className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
            onClick={handleSaveChanges}
            data-testid="button-save-settings-header"
          >
            Save changes
          </Button>
        }
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-7 space-y-4">
          <SectionPanel
            title="Restaurant details"
            subtitle="Public information shown to customers."
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  data-testid="input-restaurant-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Cuisine</Label>
                <Input
                  value={profile.cuisine}
                  onChange={(e) =>
                    setProfile({ ...profile, cuisine: e.target.value })
                  }
                  data-testid="input-cuisine"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={profile.mobile}
                  onChange={(e) =>
                    setProfile({ ...profile, mobile: e.target.value })
                  }
                  data-testid="input-phone"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Address</Label>
                <Input
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  data-testid="input-address"
                />
              </div>
            </div>
          </SectionPanel>

          <SectionPanel
            title="Working hours"
            subtitle="Open / close per day. Toggle off for closed days."
          >
            <div className="space-y-2">
              {profile.workingHours.map((h, i) => (
                <div
                  key={h.day}
                  className="grid grid-cols-12 items-center gap-2"
                  data-testid={`hours-${h.day}`}
                >
                  <div className="col-span-2 text-sm font-medium">{h.day}</div>
                  <div className="col-span-4">
                    <Input
                      type="time"
                      value={h.startTime}
                      onChange={(e) => {
                        const next = profile.workingHours.slice();
                        next[i] = { ...h, startTime: e.target.value };
                        setProfile({ ...profile, workingHours: next });
                      }}
                      disabled={h.status === "Closed"}
                      data-testid={`input-open-${h.day}`}
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="time"
                      value={h.endTime}
                      onChange={(e) => {
                        const next = profile.workingHours.slice();
                        next[i] = { ...h, endTime: e.target.value };
                        setProfile({ ...profile, workingHours: next });
                      }}
                      disabled={h.status === "Closed"}
                      data-testid={`input-close-${h.day}`}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="text-xs text-muted-foreground">
                      {h.status}
                    </span>
                    <Switch
                      checked={h.status === "Open"}
                      onCheckedChange={(isOpen) => {
                        // ✅ FIXED: Uses explicit switch boolean flag safely
                        const next = profile.workingHours.slice();
                        next[i] = {
                          ...h,
                          status: isOpen ? "Open" : "Closed",
                        };
                        setProfile({ ...profile, workingHours: next });
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
                <Input
                  value={profile.accountHolder}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      accountHolder: e.target.value,
                    })
                  }
                  data-testid="input-bank-holder"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Account number</Label>
                <Input
                  value={profile.accountNumber}
                  disabled
                  data-testid="input-bank-account"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Routing</Label>
                <Input
                  value={profile.routing}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      routing: e.target.value,
                    })
                  }
                  data-testid="input-bank-routing"
                />
              </div>
            </div>
          </SectionPanel>
        </div>
      </div>
    </div>
  );
}
