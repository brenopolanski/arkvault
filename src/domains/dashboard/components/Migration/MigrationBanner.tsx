import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { generatePath, useHistory } from "react-router-dom";
import { useActiveProfile, useTheme } from "@/app/hooks";
import { Button } from "@/app/components/Button";
import { Link } from "@/app/components/Link";
import { Image } from "@/app/components/Image";
import { useLink } from "@/app/hooks/use-link";
import { ProfilePaths } from "@/router/paths";
import { migrationGuideUrl, migrationLearnMoreUrl } from "@/utils/polygon-migration";
import { useMigrations } from "@/app/contexts";
import { MigrationDisclaimer } from "@/domains/migration/components/MigrationDisclaimer";

export const MigrationBanner = () => {
	const { t } = useTranslation();
	const { openExternal } = useLink();
	const { isDarkMode } = useTheme();
	const history = useHistory();
	const profile = useActiveProfile();
	const { migrations, isLoading } = useMigrations();
	const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

	const confirmHandler = useCallback(() => {
		const path = generatePath(ProfilePaths.MigrationAdd, { profileId: profile.id() });
		history.push(path);
	}, [history, profile]);

	const migrateButtonHandler = useCallback(() => {
		if (migrations.length > 0 || isLoading) {
			const path = generatePath(ProfilePaths.Migration, { profileId: profile.id() });

			history.push(path);
		} else {
			setIsDisclaimerOpen(true);
		}
	}, [history, profile, migrations, isLoading]);

	return (
		<>
			<div
				data-testid="MigrationBanner"
				className="mb-4 bg-theme-primary-100 text-theme-secondary-700 dark:border-theme-secondary-800 dark:bg-theme-secondary-900 dark:text-theme-secondary-500 sm:mb-0 sm:dark:bg-black"
			>
				<div className="flex items-center px-8 lg:container md:px-10 lg:mx-auto">
					<div className="max-w-2xl flex-1 py-6">
						<h2 className="text-lg text-theme-secondary-900 dark:text-theme-secondary-200 md:text-2xl">
							{t("DASHBOARD.MIGRATION_BANNER.TITLE")}
						</h2>

						<div className="leading-7">
							{t("DASHBOARD.MIGRATION_BANNER.DESCRIPTION")}{" "}
							<Link to={migrationGuideUrl()} isExternal>
								{t("DASHBOARD.MIGRATION_BANNER.MIGRATION_GUIDE")}
							</Link>
							.
						</div>

						<div className="mt-8 flex space-x-3">
							<Button
								variant="primary"
								onClick={migrateButtonHandler}
								data-testid="MigrationBanner--migrate"
							>
								{t("DASHBOARD.MIGRATION_BANNER.MIGRATE_TOKENS")}
							</Button>
							<Button
								data-testid="MigrationBanner--learnmore"
								variant="secondary-alt"
								onClick={() => openExternal(migrationLearnMoreUrl())}
							>
								{t("COMMON.LEARN_MORE")}
							</Button>
						</div>
					</div>

					<div className="hidden w-[304px] flex-shrink-0 pt-2 pb-4 md:block lg:w-[475px]">
						<Image name="PolygonMigrationBanner" useAccentColor={!isDarkMode} />
					</div>
				</div>
			</div>

			<MigrationDisclaimer
				isOpen={isDisclaimerOpen}
				onClose={() => setIsDisclaimerOpen(false)}
				onCancel={() => setIsDisclaimerOpen(false)}
				onConfirm={confirmHandler}
			/>
		</>
	);
};
