import React, { useState, useEffect } from "react";
import {
  FiShoppingBag,
  FiSave,
  FiChevronDown,
  FiSearch,
  FiPlusCircle,
  FiEye,
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { SharedToggleRow } from "@/components/ui/SharedToggleRow";
import { MarketplaceSettingsData } from "@/services/admin/settings.service";

interface MarketplaceTabProps {
  settings?: MarketplaceSettingsData;
  onSave?: (data: Partial<MarketplaceSettingsData>) => Promise<boolean>;
  isSaving?: boolean;
}

export default function PlatformSettingsMarketplace({
  settings = {},
  onSave,
  isSaving = false,
}: MarketplaceTabProps) {
  const [toggles, setToggles] = useState({
    listingApprovalRequired: settings.listingApprovalRequired ?? false,
    allowGuestBrowsing: settings.allowGuestBrowsing ?? true,
    allowBuyerRegistrations: settings.allowBuyerRegistrations ?? true,
    allowSellerRegistrations: settings.allowSellerRegistrations ?? true,
    requireProjectBudget: settings.requireProjectBudget ?? false,
    requireProjectDeadline: settings.requireProjectDeadline ?? false,
    allowFixedPriceProjects: settings.allowFixedPriceProjects ?? true,
    allowHourlyProjects: settings.allowHourlyProjects ?? true,
    showCollaboratorRatings: settings.showCollaboratorRatings ?? true,
    showCollaboratorReviews: settings.showCollaboratorReviews ?? true,
    allowCollaboratorsToHideEarnings:
      settings.allowCollaboratorsToHideEarnings ?? true,
    searchEnabled: settings.searchEnabled ?? true,
    featuredListingsEnabled: settings.featuredListingsEnabled ?? true,
    allowSponsoredListings: settings.allowSponsoredListings ?? false,
    enableLocationBasedSearch: settings.enableLocationBasedSearch ?? true,
    enableSkillBasedSearch: settings.enableSkillBasedSearch ?? true,
  });

  const [maxListings, setMaxListings] = useState<number>(
    settings.maxActiveListingsPerUser || 10
  );
  const [minBudget, setMinBudget] = useState<number>(
    settings.minimumProjectBudget || 0
  );
  const [cooldownHours, setCooldownHours] = useState<number>(
    settings.projectPostingCooldownHours || 0
  );
  const [resultsPerPage, setResultsPerPage] = useState<number>(
    settings.searchResultsPerPage || 20
  );
  const [visibility, setVisibility] = useState<"all" | "verified" | "connections">(
    settings.defaultCollaboratorVisibility || "all"
  );

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setToggles({
        listingApprovalRequired: settings.listingApprovalRequired ?? false,
        allowGuestBrowsing: settings.allowGuestBrowsing ?? true,
        allowBuyerRegistrations: settings.allowBuyerRegistrations ?? true,
        allowSellerRegistrations: settings.allowSellerRegistrations ?? true,
        requireProjectBudget: settings.requireProjectBudget ?? false,
        requireProjectDeadline: settings.requireProjectDeadline ?? false,
        allowFixedPriceProjects: settings.allowFixedPriceProjects ?? true,
        allowHourlyProjects: settings.allowHourlyProjects ?? true,
        showCollaboratorRatings: settings.showCollaboratorRatings ?? true,
        showCollaboratorReviews: settings.showCollaboratorReviews ?? true,
        allowCollaboratorsToHideEarnings:
          settings.allowCollaboratorsToHideEarnings ?? true,
        searchEnabled: settings.searchEnabled ?? true,
        featuredListingsEnabled: settings.featuredListingsEnabled ?? true,
        allowSponsoredListings: settings.allowSponsoredListings ?? false,
        enableLocationBasedSearch: settings.enableLocationBasedSearch ?? true,
        enableSkillBasedSearch: settings.enableSkillBasedSearch ?? true,
      });
      setMaxListings(settings.maxActiveListingsPerUser || 10);
      setMinBudget(settings.minimumProjectBudget || 0);
      setCooldownHours(settings.projectPostingCooldownHours || 0);
      setResultsPerPage(settings.searchResultsPerPage || 20);
      setVisibility(settings.defaultCollaboratorVisibility || "all");
    }
  }, [settings]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    await onSave({
      ...toggles,
      maxActiveListingsPerUser: Math.max(1, Number(maxListings)),
      minimumProjectBudget: Math.max(0, Number(minBudget)),
      projectPostingCooldownHours: Math.max(0, Number(cooldownHours)),
      searchResultsPerPage: Math.max(5, Number(resultsPerPage)),
      defaultCollaboratorVisibility: visibility,
    });
  };

  const renderIcon = (
    IconComp: any,
    theme: "green" | "blue" | "purple" = "green"
  ) => {
    const themes = {
      green: "text-primary-green bg-primary-green/10 border-primary-green/20",
      blue: "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
      purple: "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
    };
    return (
      <div
        className={`flex justify-center items-center w-9 h-9 border rounded-xl ${themes[
          theme
        ]
          .split(" ")
          .slice(1)
          .join(" ")}`}
      >
        <IconComp className={`w-4 h-4 ${themes[theme].split(" ")[0]}`} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard
        icon={renderIcon(FiShoppingBag)}
        title="Marketplace Availability"
        subtitle="Master controls for enabling or restricting the marketplace"
      >
        <div className="flex flex-col w-full mt-2">
          <SharedToggleRow
            title="Allow Guest Browsing"
            description="Unauthenticated visitors can view public listings"
            isActive={toggles.allowGuestBrowsing}
            onToggle={() => handleToggle("allowGuestBrowsing")}
          />
          <SharedToggleRow
            title="Allow Buyer & Creator Registrations"
            description="Users can join to discover and commission collaborators"
            isActive={toggles.allowBuyerRegistrations}
            onToggle={() => handleToggle("allowBuyerRegistrations")}
          />
          <SharedToggleRow
            title="Allow Seller Registrations"
            description="Users can register to sell skills and creative services"
            isActive={toggles.allowSellerRegistrations}
            onToggle={() => handleToggle("allowSellerRegistrations")}
          />
          <SharedToggleRow
            title="Featured Listings Visible"
            description="Promoted and featured listings appear on discovery feeds"
            isActive={toggles.featuredListingsEnabled}
            onToggle={() => handleToggle("featuredListingsEnabled")}
            isLast
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiPlusCircle)}
        title="Project & Service Posting Rules"
        subtitle="Define requirements and limits for posting projects"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-2">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-semibold text-white/50">
              Maximum Active Listings Per User
            </label>
            <div className="relative w-full">
              <select
                value={maxListings}
                onChange={(e) => setMaxListings(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white appearance-none focus:outline-none focus:border-primary-green transition-colors"
              >
                <option value={5} className="bg-card-bg-alt text-white">5 active listings</option>
                <option value={10} className="bg-card-bg-alt text-white">10 active listings</option>
                <option value={25} className="bg-card-bg-alt text-white">25 active listings</option>
                <option value={50} className="bg-card-bg-alt text-white">50 active listings</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-semibold text-white/50">
              Minimum Project Budget (₦)
            </label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-semibold text-white/50">
              Posting Cooldown (Hours)
            </label>
            <input
              type="number"
              value={cooldownHours}
              onChange={(e) => setCooldownHours(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <SharedToggleRow
            title="Require Admin Approval for New Listings"
            description="Each new listing is reviewed before going live"
            isActive={toggles.listingApprovalRequired}
            onToggle={() => handleToggle("listingApprovalRequired")}
          />
          <SharedToggleRow
            title="Require Project Budget on Posts"
            description="Creators must specify a minimum funding amount"
            isActive={toggles.requireProjectBudget}
            onToggle={() => handleToggle("requireProjectBudget")}
          />
          <SharedToggleRow
            title="Require Project Deadline"
            description="Creators must specify target timeline or completion deadline"
            isActive={toggles.requireProjectDeadline}
            onToggle={() => handleToggle("requireProjectDeadline")}
          />
          <SharedToggleRow
            title="Allow Fixed-Price Milestones"
            description="Support flat-fee escrow contract arrangements"
            isActive={toggles.allowFixedPriceProjects}
            onToggle={() => handleToggle("allowFixedPriceProjects")}
          />
          <SharedToggleRow
            title="Allow Hourly Projects"
            description="Support hourly tracked collaboration projects"
            isActive={toggles.allowHourlyProjects}
            onToggle={() => handleToggle("allowHourlyProjects")}
            isLast
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiEye, "purple")}
        title="Collaborator Discovery & Profile Rules"
        subtitle="Control collaborator profile exposure and statistics"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-semibold text-white/50">
              Default Collaborator Visibility
            </label>
            <div className="relative w-full">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white appearance-none focus:outline-none focus:border-primary-green transition-colors"
              >
                <option value="all" className="bg-card-bg-alt text-white">All Visitors (Public)</option>
                <option value="verified" className="bg-card-bg-alt text-white">Verified Users Only</option>
                <option value="connections" className="bg-card-bg-alt text-white">Connections Only</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <SharedToggleRow
            title="Show Collaborator Ratings"
            description="Display 5-star ratings on collaborator cards and profiles"
            isActive={toggles.showCollaboratorRatings}
            onToggle={() => handleToggle("showCollaboratorRatings")}
          />
          <SharedToggleRow
            title="Show Collaborator Reviews"
            description="Display verified written testimonials from past clients"
            isActive={toggles.showCollaboratorReviews}
            onToggle={() => handleToggle("showCollaboratorReviews")}
          />
          <SharedToggleRow
            title="Allow Collaborators to Hide Earnings"
            description="Users can choose whether past total earnings appear publicly"
            isActive={toggles.allowCollaboratorsToHideEarnings}
            onToggle={() => handleToggle("allowCollaboratorsToHideEarnings")}
            isLast
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiSearch, "blue")}
        title="Search & Discovery Settings"
        subtitle="Configure how users find collaborators and projects"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-semibold text-white/50">
              Results Per Page
            </label>
            <div className="relative w-full">
              <select
                value={resultsPerPage}
                onChange={(e) => setResultsPerPage(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white appearance-none focus:outline-none focus:border-primary-green transition-colors"
              >
                <option value={10} className="bg-card-bg-alt text-white">10 listings</option>
                <option value={20} className="bg-card-bg-alt text-white">20 listings</option>
                <option value={50} className="bg-card-bg-alt text-white">50 listings</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <SharedToggleRow
            title="Enable Global Search"
            description="Enable marketplace keyword indexing"
            isActive={toggles.searchEnabled}
            onToggle={() => handleToggle("searchEnabled")}
          />
          <SharedToggleRow
            title="Enable Skill & Specialty Filtering"
            description="Allow filtering by producers, vocalists, audio engineers, etc."
            isActive={toggles.enableSkillBasedSearch}
            onToggle={() => handleToggle("enableSkillBasedSearch")}
          />
          <SharedToggleRow
            title="Enable Location-Based Discovery"
            description="Show collaborators based on city, state, or region"
            isActive={toggles.enableLocationBasedSearch}
            onToggle={() => handleToggle("enableLocationBasedSearch")}
            isLast
          />
        </div>
      </SectionCard>

      <div className="flex flex-row items-center justify-between px-5 py-3.5 w-full bg-card-bg/20 border border-white/5 rounded-xl mt-2">
        <span className="text-xs text-white/50 leading-relaxed">
          Changes will apply immediately across the Marketplace discovery engine
        </span>
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={FiSave}
            iconPosition="left"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

