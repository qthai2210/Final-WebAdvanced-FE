// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import {
//   getMyRecipients,
//   updateRecipient,
//   deleteRecipient,
// } from "@/store/recipient/recipientSlice";
// import { RecipientDetailCard } from "@/components/RecipientDetailCard";
// import { RecipientDialog } from "@/components/RecipientDialog";

// export const RecipientsListPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { recipients, loading, error } = useSelector(
//     (state: RootState) => state.recipient
//   );
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   useEffect(() => {
//     dispatch(getMyRecipients());
//   }, [dispatch]);

//   const handleUpdateRecipient = async (updatedRecipient: {
//     accountNumber: string;
//     nickname: string;
//   }) => {
//     await dispatch(updateRecipient(updatedRecipient)).unwrap();
//     dispatch(getMyRecipients());
//   };

//   const handleDeleteRecipient = async (accountNumber: string) => {
//     await dispatch(deleteRecipient(accountNumber)).unwrap();
//     dispatch(getMyRecipients());
//   };

//   const handleOpenDialog = () => setIsDialogOpen(true);
//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//     dispatch(getMyRecipients());
//   };

//   if (loading) {
//     return (
//       <div>
//         <CircularProgress /> Loading...
//       </div>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {error && <div className="text-red-500 text-sm">{error}</div>}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
//         <Typography variant="h4">Recipients List</Typography>
//         <Button variant="contained" color="primary" onClick={handleOpenDialog}>
//           Create New Recipient
//         </Button>
//       </Box>

//       <Box sx={{ mt: 3 }}>
//         <div>
//           {recipients.length > 0 ? (
//             recipients
//               .filter((recipient) => recipient && recipient._id)
//               .map((recipient) => (
//                 <RecipientDetailCard
//                   key={recipient._id}
//                   recipient={recipient}
//                   onDeleted={handleDeleteRecipient}
//                   onUpdated={handleUpdateRecipient}
//                 />
//               ))
//           ) : (
//             <i className="text-xl">There is no recipient available</i>
//           )}
//         </div>
//       </Box>

//       <RecipientDialog
//         open={isDialogOpen}
//         onClose={handleCloseDialog}
//         onSuccess={handleCloseDialog}
//       />
//     </Container>
//   );
// };
