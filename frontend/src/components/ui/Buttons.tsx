import { useState } from 'react';
// import { ButtonLoadingIndicator } from '../../loading/ButtonLoadingIndicator'

function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ')
}

const ButtonLoadingIndicator = ({ type }: any) => {

    return (
        <div role="status">
            <svg
                aria-hidden="true"
                className={classNames(
                    type === 'danger' ? 'fill-red-600' : 'fill-green-600',
                    'w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 '
                )}
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );
}

type PrimaryButtonProps = {
    onClick?: (event: React.FormEvent<Element>) => void;
    label?: string;
    type?: 'submit' | 'button';
};

const PrimaryButton = ({ onClick, label, type }: PrimaryButtonProps) => {
    const [loading, setLoading] = useState(false);
    const handleClick = async (event: React.FormEvent<Element>) => {
        if (onClick) {
            setLoading(true);
            try {
                await onClick(event);  // Pass the event to the onClick function
            } catch (error) {
                console.error('Error during button click:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    return (
        <button
            type={type || 'submit'}
            onClick={handleClick}
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            disabled={loading}
        >
            {loading ? (
                <div className='flex'><ButtonLoadingIndicator /><span>Loading...</span></div>) : label}
        </button>
    );
};

type SecondaryButtonProps = {
    onClick?: () => void;
    label?: string;
    showBorder?: boolean;
};

const SecondaryButton = ({ onClick, label, showBorder }: SecondaryButtonProps) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={classNames(
                showBorder
                    ? 'rounded-md bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300'
                    : 'text-sm font-semibold leading-6 dark:text-white text-gray-900'
            )}
        >
            {label}
        </button>
    );
};

export { PrimaryButton, SecondaryButton };
