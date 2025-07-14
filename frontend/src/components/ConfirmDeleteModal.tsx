import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-sm rounded-lg p-6 shadow-md">
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </Dialog.Title>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this prompt? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
