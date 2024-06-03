import { PrimaryButton, SecondaryButton } from './Buttons';

type FormProps = {
    children?: any;
    cancelLabel?: string;
    onCancel?: () => void;
    submitLabel?: string;
    onSubmit?: (event: React.FormEvent) => void;
    changes?: boolean;
    hideButtons?: boolean;
    noButtons?: boolean;
};

const Form = ({ children, cancelLabel, onCancel, submitLabel, onSubmit, changes, hideButtons, noButtons }: FormProps) => {
    return (
        <form className="pb-6" onSubmit={onSubmit}>
            <div>
                <div className="space-y-12 w-auto">{children}</div>
            </div>
            {noButtons ? null : (
                <>
                    {' '}
                    {hideButtons ? (
                        <>
                            {changes ? (
                                <div className="mt-6 flex items-center justify-end gap-x-6">
                                    <SecondaryButton label={cancelLabel} onClick={onCancel} />
                                    <PrimaryButton label={submitLabel} onClick={onSubmit} type='button' />
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <SecondaryButton label={cancelLabel} onClick={onCancel} showBorder={true} />
                            <PrimaryButton label={submitLabel} onClick={onSubmit} />
                        </div>
                    )}
                </>
            )}
        </form>
    );
};

type FormSectionProps = {
    children: any;
    headline: string;
    subline?: string;
};

const FormSection = ({ children, headline, subline }: FormSectionProps) => {
    return (
        <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-gray-400/10 pb-12 md:grid-cols-3">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{headline}</h2>
                    {subline ? <p className="mt-1 text-sm leading-6 text-gray-600">{subline}</p> : null}
                </div>
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">{children}</div>
            </div>
        </>
    );
};

type FormSectionWideProps = {
    children: any;
    headline: string;
    subline?: string;
};

const FormSectionWide = ({ children, headline, subline }: FormSectionWideProps) => {
    return (
        <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-gray-400/10 pb-12 md:grid-cols-3">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{headline}</h2>
                    {subline ? <p className="mt-1 text-sm leading-6 text-gray-600">{subline}</p> : null}
                </div>
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 md:col-span-2">{children}</div>
            </div>
        </>
    );
};

const FormSectionItem = ({ children }: any) => {
    return <div className="sm:col-span-4">{children}</div>;
};

export { Form, FormSection, FormSectionWide, FormSectionItem };
