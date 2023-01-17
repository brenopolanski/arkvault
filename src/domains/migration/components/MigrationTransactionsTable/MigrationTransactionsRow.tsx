import { DateTime } from "@ardenthq/sdk-intl";
import cn from "classnames";
import React from "react";

import { useTranslation } from "react-i18next";
import { MigrationTransactionsRowStatusProperties } from "./MigrationTransactionsTable.contracts";
import { AmountLabel } from "@/app/components/Amount";
import { Circle } from "@/app/components/Circle";
import { Icon } from "@/app/components/Icon";
import { Link } from "@/app/components/Link";
import { TableCell, TableRow } from "@/app/components/Table";
import { Tooltip } from "@/app/components/Tooltip";
import { useTimeFormat } from "@/app/hooks/use-time-format";
import { Button } from "@/app/components/Button";
import { Address } from "@/app/components/Address";
import { EthereumAvatar } from "@/app/components/Avatar";
import { MigrationTransactionStatus } from "@/domains/migration/migration.contracts";
import { getIcon } from "@/domains/migration/utils";
import { polygonTransactionLink } from "@/utils/polygon-migration";
import { MigrationTransactionsRowSkeleton } from "@/domains/migration/components/MigrationTransactionsTable/MigrationTransactionsRowSkeleton";

const MigrationTransactionsRowStatus: React.FC<MigrationTransactionsRowStatusProperties> = ({ status }) => {
	const { t } = useTranslation();

	const { name, color } = getIcon(status);

	return (
		<Tooltip content={t(`MIGRATION.STATUS.${status.toUpperCase()}`)}>
			<span>
				<Icon name={name} size="lg" className={color} />
			</span>
		</Tooltip>
	);
};

interface MigrationTransactionsRowProperties {
	migrationTransaction: any;
	isCompact: boolean;
	isLoading: boolean;
	onClick: () => void;
}

export const MigrationTransactionsRow = ({
	migrationTransaction,
	isCompact,
	isLoading,
	onClick,
}: MigrationTransactionsRowProperties) => {
	const timeFormat = useTimeFormat();
	const { t } = useTranslation();

	if (isLoading) {
		return <MigrationTransactionsRowSkeleton isCompact={isCompact} />;
	}

	return (
		<TableRow data-testid="MigrationTransactionsRow">
			<TableCell variant="start" isCompact={isCompact}>
				<Tooltip content={migrationTransaction.id} className="no-ligatures">
					<span className="flex items-center">
						{migrationTransaction.status === MigrationTransactionStatus.Confirmed ? (
							<Link
								to={polygonTransactionLink(migrationTransaction.id)}
								tooltip={migrationTransaction.id}
								showExternalIcon={false}
								isExternal
							>
								<Icon name="MagnifyingGlassId" />
							</Link>
						) : (
							<span className="text-theme-secondary-300 dark:text-theme-secondary-800">
								<Icon name="MagnifyingGlassId" />
							</span>
						)}
					</span>
				</Tooltip>
			</TableCell>

			<TableCell className="hidden lg:table-cell" isCompact={isCompact}>
				<span data-testid="TransactionRow__timestamp" className="whitespace-nowrap">
					{DateTime.fromUnix(migrationTransaction.timestamp).format(timeFormat)}
				</span>
			</TableCell>

			<TableCell innerClassName="gap-3" isCompact={isCompact}>
				{isCompact && (
					<span className="hidden h-5 w-5 items-center text-theme-hint-600 lg:flex">
						<Icon name="Sent" size="lg" />
					</span>
				)}

				{!isCompact && (
					<div className="hidden lg:flex">
						<Circle
							size="lg"
							className="border-theme-hint-100 bg-theme-hint-50 text-theme-hint-600 dark:border-theme-hint-300 dark:bg-theme-secondary-900 dark:text-theme-hint-300"
						>
							<Icon name="Sent" size="lg" />
						</Circle>
					</div>
				)}

				<div className="w-0 flex-1">
					<Address address={migrationTransaction.address} />
				</div>
			</TableCell>

			<TableCell innerClassName="gap-3" isCompact={isCompact}>
				<EthereumAvatar address={migrationTransaction.migrationAddress} size={isCompact ? "xs" : "lg"} />
				<div className="w-0 flex-1">
					<Address address={migrationTransaction.migrationAddress} />
				</div>
			</TableCell>

			<TableCell innerClassName="justify-center" isCompact={isCompact}>
				<MigrationTransactionsRowStatus status={migrationTransaction.status} />
			</TableCell>

			<TableCell innerClassName="justify-end" isCompact={isCompact}>
				<AmountLabel value={migrationTransaction.amount} ticker="ARK" isCompact={isCompact} isNegative />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end text-theme-secondary-text" isCompact={isCompact}>
				<Button
					variant={isCompact ? "transparent" : "secondary"}
					size={isCompact ? "icon" : undefined}
					className={cn("whitespace-nowrap", {
						"my-auto": !isCompact,
						"text-theme-primary-600 hover:text-theme-primary-700": isCompact,
					})}
					onClick={onClick}
				>
					{t("MIGRATION.PAGE_MIGRATION.VIEW_DETAILS")}
				</Button>
			</TableCell>
		</TableRow>
	);
};
